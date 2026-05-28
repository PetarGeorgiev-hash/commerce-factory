import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { del } from "@vercel/blob";

const sizeSchema = z.object({
  size: z.string().min(1),
  stock: z.number().int().min(0),
});

const variantSchema = z.object({
  color: z.string().default(""),
  colorHex: z.string().optional(),
  price: z.number().positive(),
  images: z.array(z.string().url()).min(1, "At least one image required"),
  sizes: z.array(sizeSchema).min(1, "At least one size required"),
});

export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.product.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: {
        variants: {
          include: { sizes: true },
        },
      },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.product.findUnique({
        where: { id: input.id },
        include: {
          variants: {
            include: { sizes: true },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        brand: z.string().min(1),
        category: z.string().min(1),
        variants: z.array(variantSchema).min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.create({
        data: {
          title: input.title,
          description: input.description,
          brand: input.brand,
          category: input.category,
          createdById: ctx.session.user.id,
          variants: {
            create: input.variants.map((v) => ({
              color: v.color,
              colorHex: v.colorHex,
              price: v.price,
              images: v.images,
              sizes: {
                create: v.sizes.map((s) => ({
                  size: s.size,
                  stock: s.stock,
                })),
              },
            })),
          },
        },
        include: { variants: { include: { sizes: true } } },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        description: z.string().optional(),
        brand: z.string().min(1),
        category: z.string().min(1),
        variants: z.array(variantSchema).min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingVariants = await ctx.db.product_Variant.findMany({
        where: { productId: input.id },
        select: { images: true },
      });
      const oldUrls = existingVariants.flatMap((v) => v.images);

      const newUrls = new Set(input.variants.flatMap((v) => v.images));
      const urlsToDelete = oldUrls.filter((url) => !newUrls.has(url));

      await ctx.db.product_Variant.deleteMany({
        where: { productId: input.id },
      });

      const updated = await ctx.db.product.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          brand: input.brand,
          category: input.category,
          variants: {
            create: input.variants.map((v) => ({
              color: v.color,
              colorHex: v.colorHex,
              price: v.price,
              images: v.images,
              sizes: {
                create: v.sizes.map((s) => ({
                  size: s.size,
                  stock: s.stock,
                })),
              },
            })),
          },
        },
        include: { variants: { include: { sizes: true } } },
      });

      if (urlsToDelete.length > 0) {
        await del(urlsToDelete);
      }

      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const variants = await ctx.db.product_Variant.findMany({
        where: { productId: input.id },
        select: { images: true },
      });
      const allImages = variants.flatMap((v) => v.images);

      const deleted = await ctx.db.product.update({
        where: { id: input.id },
        data: { deletedAt: new Date(), deletedById: ctx.session.user.id },
      });

      if (allImages.length > 0) await del(allImages);

      return deleted;
    }),
});
