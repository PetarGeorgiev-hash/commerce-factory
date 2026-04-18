import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const productRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.number().optional(),
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const product = ctx.db.product.create({
        data: {
          name: input.name,
          description: input.description,
          price: input.price,
          images: input.image ? [input.image] : [],
          createdById: ctx.session.user.id,
        },
      });

      await ctx.db.activityLog.create({
        data: {
          userId: ctx.session.user.id,
          action: "create_product",
          entity: "product",
          entityId: (await product).id,
          message: `Created product "${input.name}"`,
        },
      });

      return product;
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.product.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdById: ctx.session.user.id },
    });
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.product.findMany({
      orderBy: { createdAt: "desc" },
      where: { deletedAt: null },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.product.findUnique({
        where: { id: input.id },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().optional(),
        price: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          price: input.price,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.update({
        where: { id: input.id },
        data: {
          deletedAt: new Date(),
          deletedById: ctx.session.user.id,
        },
      });
    }),
});
