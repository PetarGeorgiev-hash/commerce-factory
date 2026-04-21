import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const activityRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        action: z.string(),
        entity: z.string().optional(),
        entityId: z.string().optional(),
        message: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.activityLog.create({
        data: {
          userId: ctx.session.user.id,
          ...input,
        },
      });
    }),
});
