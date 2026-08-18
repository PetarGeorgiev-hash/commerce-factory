import z from "zod";
import { TRPCError } from "@trpc/server";
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";
import { sendOrderEmails } from "@/server/email/order-notification";
import { calcDiscount } from "./promo";
import type { OrderStatus } from "../../../../generated/prisma";

const orderItemSchema = z.object({
  sizeId: z.string().min(1),
  qty: z.number().int().min(1).max(20),
});

const createOrderSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().email(),
  phone: z.string().trim().min(6).max(30),
  deliveryType: z.enum(["ADDRESS", "SPEEDY_OFFICE", "ECONT_OFFICE"]),
  city: z.string().trim().min(1).max(100),
  postalCode: z.string().trim().max(10).optional(),
  address: z.string().trim().min(1).max(300),
  note: z.string().trim().max(500).optional(),
  promoCode: z.string().trim().max(30).optional(),
  items: z.array(orderItemSchema).min(1).max(30),
});

/** Which status changes are allowed, and whether they put stock back. */
const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["DONE", "CANCELLED"],
  DONE: ["RETURNED"],
  CANCELLED: [],
  RETURNED: [],
};

export const orderRouter = createTRPCRouter({
  create: publicProcedure
    .input(createOrderSchema)
    .mutation(async ({ ctx, input }) => {
      // Collapse duplicate size rows so one conditional decrement covers each size.
      const qtyBySize = new Map<string, number>();
      for (const item of input.items) {
        qtyBySize.set(item.sizeId, (qtyBySize.get(item.sizeId) ?? 0) + item.qty);
      }

      // Read product data outside the transaction — on serverless Postgres a
      // cold connection can take seconds, and reads don't need the write lock.
      const sizes = await ctx.db.product_Variant_Size.findMany({
        where: { id: { in: [...qtyBySize.keys()] } },
        include: {
          variant: { include: { product: true } },
        },
      });

      for (const sizeId of qtyBySize.keys()) {
        const size = sizes.find((s) => s.id === sizeId);
        if (!size || size.variant.product.deletedAt) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "PRODUCT_UNAVAILABLE",
          });
        }
      }

      // Prices come from the database, never from the client.
      const subtotal = [...qtyBySize].reduce((sum, [sizeId, qty]) => {
        const size = sizes.find((s) => s.id === sizeId)!;
        return sum + size.variant.price * qty;
      }, 0);

      // Re-validate the promo code server-side; the client-side check is
      // only cosmetic.
      let promo = null;
      if (input.promoCode) {
        promo = await ctx.db.promoCode.findUnique({
          where: { code: input.promoCode.toUpperCase() },
        });
        if (!promo || !promo.active) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "INVALID_PROMO",
          });
        }
      }
      const discount = promo
        ? calcDiscount(promo.type, promo.value, subtotal)
        : 0;

      const order = await ctx.db.$transaction(
        async (tx) => {
          for (const [sizeId, qty] of qtyBySize) {
            const size = sizes.find((s) => s.id === sizeId)!;

            // Atomic conditional decrement: only succeeds if enough stock is
            // left at this exact moment, so two simultaneous orders can never
            // both take the last pair.
            const updated = await tx.product_Variant_Size.updateMany({
              where: { id: sizeId, stock: { gte: qty } },
              data: { stock: { decrement: qty } },
            });
            if (updated.count === 0) {
              throw new TRPCError({
                code: "CONFLICT",
                message: `OUT_OF_STOCK:${sizeId}:${size.variant.product.title} (${size.size})`,
              });
            }
          }

          if (promo) {
            await tx.promoCode.update({
              where: { id: promo.id },
              data: { usedCount: { increment: 1 } },
            });
          }

          return tx.order.create({
            data: {
              firstName: input.firstName,
              lastName: input.lastName,
              email: input.email,
              phone: input.phone,
              deliveryType: input.deliveryType,
              city: input.city,
              postalCode: input.postalCode,
              address: input.address,
              note: input.note,
              subtotal,
              discount,
              promoCodeId: promo?.id,
              promoCodeText: promo?.code,
              items: {
                create: [...qtyBySize].map(([sizeId, qty]) => {
                  const size = sizes.find((s) => s.id === sizeId)!;
                  return {
                    sizeId,
                    qty,
                    title: size.variant.product.title,
                    color: size.variant.color,
                    sizeLabel: size.size,
                    price: size.variant.price,
                    image: size.variant.images[0] ?? null,
                  };
                }),
              },
            },
            include: { items: true },
          });
        },
        // Serverless Postgres (Neon) can take seconds on a cold start; the
        // default 5s transaction budget is too tight for it.
        { maxWait: 10_000, timeout: 20_000 },
      );

      // Send admin + customer emails after the transaction committed; they
      // log failures internally and never reject. The customer email uses
      // the language the shopper was browsing in.
      const locale = /(?:^|;\s*)locale=bg(?:;|$)/.test(
        ctx.headers.get("cookie") ?? "",
      )
        ? ("bg" as const)
        : ("en" as const);
      await sendOrderEmails(order, locale);

      return { id: order.id, orderNumber: order.orderNumber };
    }),

  getAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
  }),

  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["DONE", "CANCELLED", "RETURNED"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(
        async (tx) => {
          const order = await tx.order.findUnique({
            where: { id: input.id },
            include: { items: true },
          });
          if (!order) throw new TRPCError({ code: "NOT_FOUND" });

          if (!TRANSITIONS[order.status].includes(input.status)) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `INVALID_TRANSITION:${order.status}->${input.status}`,
            });
          }

          // Cancelled and returned orders put the shoes back on the shelf.
          if (input.status === "CANCELLED" || input.status === "RETURNED") {
            for (const item of order.items) {
              if (!item.sizeId) continue;
              await tx.product_Variant_Size.updateMany({
                where: { id: item.sizeId },
                data: { stock: { increment: item.qty } },
              });
            }
          }

          return tx.order.update({
            where: { id: input.id },
            data: { status: input.status },
            include: { items: true },
          });
        },
        { maxWait: 10_000, timeout: 20_000 },
      );
    }),
});
