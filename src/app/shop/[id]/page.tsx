import { Product } from "@/components/Shop/Product";
import { db } from "@/server/db";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  const product = await db.product.findUnique({
    where: { id, deletedAt: null },
    include: {
      variants: {
        include: { sizes: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!product) notFound();

  return <Product product={product} />;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id, deletedAt: null },
    select: { title: true, description: true, brand: true },
  });
  if (!product) return {};
  return {
    title: `${product.title}${product.brand ? ` — ${product.brand}` : ""}`,
    description: product.description ?? undefined,
  };
}
