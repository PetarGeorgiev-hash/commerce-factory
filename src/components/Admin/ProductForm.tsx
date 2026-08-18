"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Upload, X, ArrowLeft } from "lucide-react";
import { uploadToBlob } from "@/lib/utils";
import { api } from "@/trpc/react";
import ProductPreview from "./ProductPreview";
import Image from "next/image";

type SizeStock = { size: string; quantity: number };
type ImagePreview = { file?: File; url: string };

type Variant = {
  id: string;
  color: string;
  colorHex?: string;
  sizes: SizeStock[];
  price: number;
  imagesFiles: File[];
  imagePreviews: ImagePreview[];
  images: string[];
};

function emptyVariant(): Variant {
  return {
    id: crypto.randomUUID(),
    color: "",
    colorHex: "",
    sizes: [],
    price: 0,
    imagesFiles: [],
    imagePreviews: [],
    images: [],
  };
}

interface Props {
  productId?: string;
}

export default function ProductForm({ productId }: Props) {
  const router = useRouter();
  const isEditing = !!productId;

  const { data: existing, isLoading } = api.product.getById.useQuery(
    { id: productId! },
    { enabled: isEditing },
  );

  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [brand, setBrand] = useState(existing?.brand ?? "");
  const [category, setCategory] = useState(existing?.category ?? "");
  const [multipleVariants, setMultipleVariants] = useState(
    (existing?.variants.length ?? 0) > 1,
  );
  const [variants, setVariants] = useState<Variant[]>(
    existing?.variants.map((v) => ({
      id: v.id,
      color: v.color ?? "",
      colorHex: v.colorHex ?? "",
      price: v.price,
      images: v.images,
      imagesFiles: [],
      imagePreviews: v.images.map((url) => ({ url })),
      sizes: v.sizes.map((s) => ({ size: s.size, quantity: s.stock })),
    })) ?? [emptyVariant()],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!existing) return;
    setTitle(existing.title);
    setDescription(existing.description ?? "");
    setBrand(existing.brand ?? "");
    setCategory(existing.category ?? "");
    setMultipleVariants(existing.variants.length > 1);
    setVariants(
      existing.variants.map((v) => ({
        id: v.id,
        color: v.color ?? "",
        colorHex: v.colorHex ?? "",
        price: v.price,
        images: v.images,
        imagesFiles: [],
        imagePreviews: v.images.map((url) => ({ url })),
        sizes: v.sizes.map((s) => ({ size: s.size, quantity: s.stock })),
      })),
    );
  }, [existing]);

  const utils = api.useUtils();

  const createProduct = api.product.create.useMutation({
    onSuccess: () => void router.push("/admin/products"),
    onError: (err) => setError(err.message),
  });

  const updateProduct = api.product.update.useMutation({
    onSuccess: () => {
      void utils.product.getById.invalidate({ id: productId });
      void router.push("/admin/products");
    },
    onError: (err) => setError(err.message),
  });

  const addVariant = () => setVariants((p) => [...p, emptyVariant()]);
  const removeVariant = (index: number) => {
    setVariants((p) => {
      const updated = p.filter((_, i) => i !== index);
      if (updated.length === 1) setMultipleVariants(false);
      return updated;
    });
  };
  const updateVariant = (
    index: number,
    field: keyof Variant,
    value: Variant[keyof Variant],
  ) =>
    setVariants((p) =>
      p.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    );

  const handleSubmit = async () => {
    if (!title.trim()) return setError("Title is required");
    if (!brand.trim()) return setError("Brand is required");
    if (!category.trim()) return setError("Category is required");
    if (variants.some((v) => v.price <= 0))
      return setError("All variants need a valid price greater than 0");
    if (variants.some((v) => v.imagePreviews.length === 0))
      return setError("Each variant needs at least one image");

    setIsSubmitting(true);
    setError(null);
    const uploadedUrls: string[] = [];

    try {
      const uploadedVariants = await Promise.all(
        variants.map(async (variant) => {
          const newUrls = await Promise.all(
            variant.imagesFiles.map(async (file) => {
              const res = await uploadToBlob(file);
              uploadedUrls.push(res.url);
              return res.url;
            }),
          );
          const existingUrls = variant.imagePreviews
            .filter((p) => !p.file)
            .map((p) => p.url);
          return {
            color: variant.color,
            colorHex: variant.colorHex,
            price: variant.price,
            images: [...existingUrls, ...newUrls],
            sizes: variant.sizes.map((s) => ({
              size: s.size,
              stock: s.quantity,
            })),
          };
        }),
      );

      const payload = {
        title,
        description,
        brand,
        category,
        variants: uploadedVariants,
      };
      if (isEditing) {
        await updateProduct.mutateAsync({ id: productId, ...payload });
      } else {
        await createProduct.mutateAsync(payload);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      if (uploadedUrls.length > 0) {
        await fetch("/api/blob-delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: uploadedUrls }),
        }).catch((deleteError) =>
          console.error("Failed to clean up uploaded blobs:", deleteError),
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing && isLoading) {
    return (
      <div className="bg-background flex h-screen items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="border-foreground mx-auto h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
          <p className="text-muted-foreground text-xs tracking-widest uppercase">
            Loading
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="border-border border-b px-8 py-8">
        <div className="mx-auto max-w-4xl">
          <button
            onClick={() => void router.back()}
            className="text-muted-foreground hover:text-foreground mb-6 flex items-center gap-2 text-xs tracking-[0.15em] uppercase transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
          <p className="text-muted-foreground mb-1 text-xs tracking-[0.25em] uppercase">
            {isEditing ? "Edit" : "New"} Product
          </p>
          <h1 className="text-foreground font-serif text-4xl font-light tracking-tight">
            {isEditing ? title || "Untitled" : "Create Product"}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-12 px-8 py-12">
        <section>
          <SectionLabel>Basic Information</SectionLabel>
          <div className="space-y-4">
            <Field label="Title">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Essential Hoodie"
                className="border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:border-foreground w-full border px-4 py-3 text-sm transition-colors outline-none"
              />
            </Field>
            <Field label="Description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the product..."
                rows={4}
                className="border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:border-foreground w-full resize-none border px-4 py-3 text-sm transition-colors outline-none"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Brand">
                <input
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Fear of God"
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:border-foreground w-full border px-4 py-3 text-sm transition-colors outline-none"
                />
              </Field>
              <Field label="Category">
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Hoodies"
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:border-foreground w-full border px-4 py-3 text-sm transition-colors outline-none"
                />
              </Field>
            </div>
          </div>
        </section>
        <section>
          <div className="border-border flex items-center justify-between border-y py-5">
            <div>
              <p className="text-foreground text-sm font-medium tracking-wide">
                Multiple Variants
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Enable to add different colors, each with their own images and
                sizes
              </p>
            </div>
            <button
              onClick={() => setMultipleVariants((v) => !v)}
              className={`relative h-6 w-12 rounded-full transition-colors duration-200 ${
                multipleVariants ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`bg-primary-foreground absolute top-0.5 h-5 w-5 rounded-full shadow transition-transform duration-200 ${
                  multipleVariants ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </section>
        <section className="space-y-8">
          <SectionLabel>
            {multipleVariants ? "Variants" : "Pricing, Sizes & Images"}
          </SectionLabel>

          {variants.map((variant, index) => (
            <VariantCard
              key={variant.id}
              variant={variant}
              index={index}
              showColor={multipleVariants}
              canRemove={multipleVariants && variants.length > 1}
              updateVariant={updateVariant}
              removeVariant={removeVariant}
            />
          ))}
          {multipleVariants && (
            <button
              onClick={addVariant}
              className="border-border text-muted-foreground hover:border-foreground hover:text-foreground flex items-center gap-2 border border-dashed px-5 py-3 text-xs tracking-[0.15em] uppercase transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Variant
            </button>
          )}
        </section>
        {error && (
          <p className="border-destructive/20 bg-destructive/10 text-destructive border px-4 py-3 text-sm">
            {error}
          </p>
        )}

        <div className="border-border flex items-center justify-end gap-4 border-t pt-8">
          <ProductPreview
            title={title}
            description={description}
            brand={brand}
            category={category}
            variants={variants.map((v) => ({
              id: v.id,
              color: v.color,
              colorHex: v.colorHex,
              price: v.price,
              imageUrls: v.imagePreviews.map((p) => p.url),
              sizes: v.sizes,
            }))}
          />
          <button
            onClick={() => void router.back()}
            className="text-muted-foreground hover:text-foreground px-6 py-3 text-xs tracking-[0.15em] uppercase transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => void handleSubmit()}
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground px-8 py-3 text-xs tracking-[0.15em] uppercase transition-opacity hover:opacity-70 disabled:opacity-30"
          >
            {isSubmitting
              ? isEditing
                ? "Saving..."
                : "Creating..."
              : isEditing
                ? "Save Changes"
                : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground mb-6 text-xs tracking-[0.2em] uppercase">
      {children}
    </p>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-muted-foreground mb-1.5 block text-xs tracking-widest uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}

function VariantCard({
  variant,
  index,
  showColor,
  canRemove,
  updateVariant,
  removeVariant,
}: {
  variant: Variant;
  index: number;
  showColor: boolean;
  canRemove: boolean;
  updateVariant: (
    i: number,
    f: keyof Variant,
    v: Variant[keyof Variant],
  ) => void;
  removeVariant: (i: number) => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    const updatedPreviews = [...variant.imagePreviews, ...newPreviews];
    const updatedFiles = [...variant.imagesFiles, ...files];
    updateVariant(index, "imagePreviews", updatedPreviews);
    updateVariant(index, "imagesFiles", updatedFiles);
  };

  const removeImage = (i: number) => {
    const preview = variant.imagePreviews[i];
    if (preview?.file) URL.revokeObjectURL(preview.url);
    const updatedPreviews = variant.imagePreviews.filter((_, idx) => idx !== i);
    const updatedFiles = variant.imagesFiles.filter((_, idx) => {
      const fileBackedIndexes = variant.imagePreviews
        .map((p, pi) => (p.file ? pi : -1))
        .filter((pi) => pi !== -1);
      return (
        !fileBackedIndexes.includes(i) || idx !== fileBackedIndexes.indexOf(i)
      );
    });
    updateVariant(index, "imagePreviews", updatedPreviews);
    updateVariant(index, "imagesFiles", updatedFiles);
  };

  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null) return;
    const updated = [...variant.imagePreviews];
    const [dragged] = updated.splice(dragIndex, 1);
    if (!dragged) return;
    updated.splice(targetIndex, 0, dragged);
    updateVariant(index, "imagePreviews", updated);
    setDragIndex(null);
    setOverIndex(null);
  };

  const addSize = () =>
    updateVariant(index, "sizes", [
      ...variant.sizes,
      { size: "", quantity: 0 },
    ]);

  const removeSize = (i: number) =>
    updateVariant(
      index,
      "sizes",
      variant.sizes.filter((_, idx) => idx !== i),
    );

  const updateSize = (
    i: number,
    field: "size" | "quantity",
    value: string | number,
  ) => {
    const current = variant.sizes[i];

    if (!current) return;

    const updated = [...variant.sizes];

    if (field === "size" && typeof value === "string") {
      updated[i] = {
        ...current,
        size: value,
      };
    } else if (field === "quantity" && typeof value === "number") {
      updated[i] = {
        ...current,
        quantity: value,
      };
    }

    updateVariant(index, "sizes", updated);
  };

  const inputBase =
    "w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-foreground";

  return (
    <div className="border-border border p-8">
      <div className="mb-8 flex items-center justify-between">
        <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
          {showColor ? `Variant ${index + 1}` : "Details"}
        </p>
        {canRemove && (
          <button
            onClick={() => removeVariant(index)}
            className="text-muted-foreground hover:text-destructive flex items-center gap-1.5 text-xs transition-colors"
          >
            <X className="h-3 w-3" />
            Remove
          </button>
        )}
      </div>

      <div className="space-y-8">
        {/* Color + Price */}
        <div
          className={`grid gap-4 ${showColor ? "grid-cols-3" : "max-w-xs grid-cols-1"}`}
        >
          {showColor && (
            <>
              <Field label="Color Name">
                <input
                  value={variant.color}
                  onChange={(e) =>
                    updateVariant(index, "color", e.target.value)
                  }
                  placeholder="e.g. Oat"
                  className={inputBase}
                />
              </Field>
              <Field label="Color Hex">
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={variant.colorHex ?? "#000000"}
                    onChange={(e) =>
                      updateVariant(index, "colorHex", e.target.value)
                    }
                    className="border-border bg-background h-11 w-12 cursor-pointer border p-1"
                  />
                  <input
                    value={variant.colorHex}
                    onChange={(e) =>
                      updateVariant(index, "colorHex", e.target.value)
                    }
                    placeholder="#000000"
                    className={inputBase}
                  />
                </div>
              </Field>
            </>
          )}
          <Field label="Price (EURO)">
            <input
              type="number"
              value={variant.price === 0 ? "" : variant.price}
              onChange={(e) =>
                updateVariant(index, "price", Number(e.target.value))
              }
              placeholder="0.00"
              min={0.01}
              step={0.01}
              className={inputBase}
            />
          </Field>
        </div>

        {/* Sizes */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-muted-foreground text-xs tracking-widest uppercase">
              Sizes & Stock
            </label>
            <button
              onClick={addSize}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs tracking-widest uppercase transition-colors"
            >
              <Plus className="h-3 w-3" />
              Add Size
            </button>
          </div>

          {variant.sizes.length === 0 ? (
            <p className="text-muted-foreground/40 py-4 text-center text-xs">
              No sizes added yet
            </p>
          ) : (
            <div className="divide-border border-border divide-y border">
              <div className="bg-muted text-muted-foreground grid grid-cols-[1fr_1fr_auto] gap-4 px-4 py-2 text-xs tracking-widest uppercase">
                <span>Size</span>
                <span>Stock</span>
                <span />
              </div>
              {variant.sizes.map((s, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_1fr_auto] items-center gap-4 px-4 py-2"
                >
                  <input
                    value={s.size}
                    onChange={(e) => updateSize(i, "size", e.target.value)}
                    placeholder="EU 42"
                    className="text-foreground placeholder:text-muted-foreground/40 focus:border-foreground border-0 bg-transparent text-sm outline-none focus:border-b"
                  />
                  <input
                    type="number"
                    value={s.quantity === 0 ? "" : s.quantity}
                    onChange={(e) =>
                      updateSize(i, "quantity", Number(e.target.value))
                    }
                    placeholder="0"
                    min={0}
                    className="text-foreground placeholder:text-muted-foreground/40 focus:border-foreground border-0 bg-transparent text-sm outline-none focus:border-b"
                  />
                  <button
                    onClick={() => removeSize(i)}
                    className="text-muted-foreground/40 hover:text-destructive transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Images */}
        <div>
          <label className="text-muted-foreground mb-3 block text-xs tracking-widest uppercase">
            Images
            <span className="text-muted-foreground/40 ml-2 tracking-normal normal-case">
              — drag to reorder
            </span>
          </label>

          <div className="grid grid-cols-5 gap-3">
            {variant.imagePreviews.map((preview, i) => (
              <div
                key={i}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverIndex(i);
                }}
                onDragLeave={() => {
                  setOverIndex(null);
                }}
                onDrop={() => handleDrop(i)}
                className={`group relative aspect-square cursor-grab overflow-hidden border-2 transition-colors ${
                  overIndex === i ? "border-foreground" : "border-transparent"
                } ${i === 0 ? "col-span-2 row-span-2" : ""}`}
              >
                <Image
                  src={preview.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
                {i === 0 && (
                  <div className="bg-foreground/60 text-background absolute bottom-2 left-2 px-2 py-0.5 text-[10px] tracking-wider uppercase">
                    Cover
                  </div>
                )}
                <button
                  onClick={() => removeImage(i)}
                  className="bg-background/90 absolute top-1 right-1 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="text-foreground h-3 w-3" />
                </button>
              </div>
            ))}

            <label className="border-border text-muted-foreground/40 hover:border-muted-foreground hover:text-muted-foreground flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 border border-dashed transition-colors">
              <Upload className="h-5 w-5" />
              <span className="text-[10px] tracking-wider uppercase">
                Upload
              </span>
              <input
                type="file"
                multiple
                hidden
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleUpload}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
