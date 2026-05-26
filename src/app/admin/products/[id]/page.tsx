// app/admin/products/[id]/page.tsx
import ProductForm from "@/components/Admin/ProductForm";

export default async function EditProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  return <ProductForm productId={id} />;
}