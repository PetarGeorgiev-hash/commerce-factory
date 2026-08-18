"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Percent, Euro, Trash2, Plus } from "lucide-react";
import { api } from "@/trpc/react";
import LoadingText from "@/components/LoadingText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DiscountType = "PERCENT" | "AMOUNT";

export default function AdminPromoCodesPage() {
  const t = useTranslations("AdminPromos");
  const { data: promos, isLoading, refetch } = api.promo.getAll.useQuery();

  const [code, setCode] = useState("");
  const [type, setType] = useState<DiscountType>("PERCENT");
  const [value, setValue] = useState("");

  const createPromo = api.promo.create.useMutation({
    onSuccess: () => {
      toast.success(t("form.created"));
      setCode("");
      setValue("");
      void refetch();
    },
    onError: (error) => {
      toast.error(
        error.message === "CODE_EXISTS" ? t("form.exists") : t("form.error"),
      );
    },
  });

  const deletePromo = api.promo.delete.useMutation({
    onSuccess: () => {
      toast.success(t("list.deleted"));
      void refetch();
    },
    onError: () => toast.error(t("list.deleteError")),
  });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const num = Number(value);
    if (!code.trim() || !num || num <= 0 || (type === "PERCENT" && num > 100)) {
      toast.error(t("form.error"));
      return;
    }
    createPromo.mutate({ code: code.trim(), type, value: num });
  }

  if (isLoading) return <LoadingText text={t("loading")} />;

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="mb-1 text-xs tracking-[0.25em] text-gray-400 uppercase">
            {t("eyebrow")}
          </p>
          <h1 className="font-serif text-4xl font-light tracking-tight text-black">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {t("count", { count: promos?.length ?? 0 })}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-10 px-4 py-8 sm:px-8">
        {/* Create form */}
        <form onSubmit={handleCreate} className="border border-gray-100 p-4 sm:p-6">
          <p className="mb-4 text-xs tracking-[0.15em] text-gray-400 uppercase">
            {t("form.title")}
          </p>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto_120px_auto] sm:items-end">
            <div className="space-y-1.5">
              <Label htmlFor="promo-code" className="text-xs text-gray-500">
                {t("form.code")}
              </Label>
              <Input
                id="promo-code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder={t("form.codePlaceholder")}
                maxLength={30}
                className="rounded-none uppercase"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">{t("form.type")}</Label>
              <div className="flex border border-gray-200">
                <button
                  type="button"
                  onClick={() => setType("PERCENT")}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm transition ${
                    type === "PERCENT"
                      ? "bg-black text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Percent className="h-3.5 w-3.5" />
                  {t("form.percent")}
                </button>
                <button
                  type="button"
                  onClick={() => setType("AMOUNT")}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm transition ${
                    type === "AMOUNT"
                      ? "bg-black text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Euro className="h-3.5 w-3.5" />
                  {t("form.amount")}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="promo-value" className="text-xs text-gray-500">
                {t("form.value")}
              </Label>
              <Input
                id="promo-value"
                type="number"
                min="0.01"
                max={type === "PERCENT" ? 100 : undefined}
                step="0.01"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="rounded-none"
              />
            </div>
            <Button
              type="submit"
              disabled={createPromo.isPending}
              className="rounded-none bg-black text-xs tracking-[0.1em] text-white uppercase hover:bg-gray-800"
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              {createPromo.isPending ? t("form.creating") : t("form.create")}
            </Button>
          </div>
        </form>

        {/* List */}
        {!promos?.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 h-px w-16 bg-gray-200" />
            <p className="text-xs tracking-[0.2em] text-gray-400 uppercase">
              {t("empty")}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 border border-gray-100">
            <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 bg-gray-50/60 px-4 py-3 text-xs tracking-[0.15em] text-gray-400 uppercase">
              <span>{t("list.code")}</span>
              <span>{t("list.discount")}</span>
              <span className="text-right">{t("list.used")}</span>
              <span className="w-9" />
            </div>
            {promos.map((promo) => (
              <div
                key={promo.id}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-4 py-4"
              >
                <span className="font-mono text-sm font-medium tracking-wider text-black">
                  {promo.code}
                </span>
                <span className="text-sm text-gray-600">
                  {promo.type === "PERCENT"
                    ? `-${promo.value}%`
                    : `-€${promo.value.toFixed(2)}`}
                </span>
                <span className="text-right text-sm text-gray-500">
                  {t("list.usedTimes", { count: promo.usedCount })}
                </span>
                <Button
                  onClick={() => deletePromo.mutate({ id: promo.id })}
                  disabled={deletePromo.isPending}
                  className="rounded p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  title={t("list.delete")}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
