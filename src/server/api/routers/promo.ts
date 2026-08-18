import z from "zod";
import { TRPCError } from "@trpc/server";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export function calcDiscount(
  type: "PERCENT" | "AMOUNT",
  value: number,
  subtotal: number,
) {
  const raw = type === "PERCENT" ? (subtotal * value) / 100 : value;
  return Math.min(Math.round(raw * 100) / 100, subtotal);
}

export const promoRouter = createTRPCRouter({
  getAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.promoCode.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { orders: true } } },
    });
  }),

  create: adminProcedure
    .input(
      z
        .object({
          code: z
            .string()
            .trim()
            .min(2)
            .max(30)
            .regex(/^[A-Za-z0-9-]+$/, "Letters, numbers and dashes only"),
          type: z.enum(["PERCENT", "AMOUNT"]),
          value: z.number().positive(),
        })
        .refine((v) => v.type !== "PERCENT" || v.value <= 100, {
          message: "Percent discount cannot exceed 100",
        }),
    )
    .mutation(async ({ ctx, input }) => {
      const code = input.code.toUpperCase();
      const existing = await ctx.db.promoCode.findUnique({ where: { code } });
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "CODE_EXISTS" });
      }
      return ctx.db.promoCode.create({
        data: { code, type: input.type, value: input.value },
      });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Orders keep a text snapshot of the code, so history stays intact.
      return ctx.db.promoCode.delete({ where: { id: input.id } });
    }),

  /** Public check used by the checkout "apply code" box. */
  validate: publicProcedure
    .input(z.object({ code: z.string().trim().min(1).max(30) }))
    .query(async ({ ctx, input }) => {
      const promo = await ctx.db.promoCode.findUnique({
        where: { code: input.code.toUpperCase() },
      });
      if (!promo?.active) return null;
      return { code: promo.code, type: promo.type, value: promo.value };
    }),
});
