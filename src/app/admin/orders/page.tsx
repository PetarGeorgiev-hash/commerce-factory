"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { format } from "date-fns";
import { Check, RotateCcw, X, Mail, Phone, MapPin } from "lucide-react";
import { api } from "@/trpc/react";
import { formatPrice } from "@/components/Cart/CartContext";
import LoadingText from "@/components/LoadingText";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type OrderStatus = "PENDING" | "DONE" | "CANCELLED" | "RETURNED";

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  DONE: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-700",
  RETURNED: "bg-gray-200 text-gray-600",
};

export default function AdminOrdersPage() {
  const t = useTranslations("AdminOrders");
  const { data: orders, isLoading, refetch } = api.order.getAll.useQuery();
  const updateStatus = api.order.updateStatus.useMutation({
    onSuccess: () => {
      toast.success(t("actions.updated"));
      void refetch();
    },
    onError: () => toast.error(t("actions.error")),
  });

  if (isLoading) return <LoadingText text={t("loading")} />;

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-1 text-xs tracking-[0.25em] text-gray-400 uppercase">
            {t("eyebrow")}
          </p>
          <h1 className="font-serif text-4xl font-light tracking-tight text-black">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {t("count", { count: orders?.length ?? 0 })}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
        {!orders?.length ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-6 h-px w-16 bg-gray-200" />
            <p className="text-xs tracking-[0.2em] text-gray-400 uppercase">
              {t("empty")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-100">
                {/* Header row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-gray-100 bg-gray-50/60 px-4 py-3">
                  <span className="text-sm font-medium text-black">
                    #{order.orderNumber}
                  </span>
                  <span className="text-xs text-gray-400">
                    {format(order.createdAt, "dd.MM.yyyy HH:mm")}
                  </span>
                  <Badge
                    className={`rounded-full border-0 text-[11px] ${STATUS_STYLES[order.status]}`}
                  >
                    {t(`status.${order.status}`)}
                  </Badge>
                  <span className="ml-auto text-sm font-medium">
                    {formatPrice(order.subtotal - order.discount)}
                  </span>
                </div>

                <div className="grid gap-4 p-4 sm:grid-cols-2">
                  {/* Customer + delivery */}
                  <div className="space-y-1.5 text-sm text-gray-600">
                    <p className="font-medium text-black">
                      {order.firstName} {order.lastName}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                      <a
                        href={`mailto:${order.email}`}
                        className="truncate hover:underline"
                      >
                        {order.email}
                      </a>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                      <a href={`tel:${order.phone}`} className="hover:underline">
                        {order.phone}
                      </a>
                    </p>
                    <p className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                      <span>
                        <span className="text-black">
                          {t(`deliveryType.${order.deliveryType}`)}
                        </span>
                        {" — "}
                        {[order.postalCode, order.city, order.address]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400">{t("cod")}</p>
                    {order.discount > 0 && (
                      <p className="text-xs text-emerald-700">
                        {t("discount")}
                        {order.promoCodeText
                          ? ` (${order.promoCodeText})`
                          : ""}
                        : −{formatPrice(order.discount)}
                      </p>
                    )}
                    {order.note && (
                      <p className="text-xs text-gray-500">
                        <span className="tracking-[0.1em] text-gray-400 uppercase">
                          {t("note")}:
                        </span>{" "}
                        {order.note}
                      </p>
                    )}
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    <p className="text-xs tracking-[0.15em] text-gray-400 uppercase">
                      {t("items", { count: order.items.length })}
                    </p>
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-gray-50">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1 text-sm">
                          <p className="truncate text-black">{item.title}</p>
                          <p className="text-xs text-gray-400">
                            {[item.color, item.sizeLabel]
                              .filter(Boolean)
                              .join(" / ")}{" "}
                            × {item.qty}
                          </p>
                        </div>
                        <span className="text-sm text-gray-600">
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                {(order.status === "PENDING" || order.status === "DONE") && (
                  <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 px-4 py-3">
                    {order.status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          disabled={updateStatus.isPending}
                          onClick={() =>
                            updateStatus.mutate({
                              id: order.id,
                              status: "DONE",
                            })
                          }
                          className="rounded-none bg-black text-xs tracking-[0.1em] text-white uppercase hover:bg-gray-800"
                        >
                          <Check className="mr-1 h-3.5 w-3.5" />
                          {t("actions.markDone")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={updateStatus.isPending}
                          onClick={() =>
                            updateStatus.mutate({
                              id: order.id,
                              status: "CANCELLED",
                            })
                          }
                          className="rounded-none text-xs tracking-[0.1em] text-red-600 uppercase hover:bg-red-50 hover:text-red-700"
                        >
                          <X className="mr-1 h-3.5 w-3.5" />
                          {t("actions.cancel")}
                        </Button>
                      </>
                    )}
                    {order.status === "DONE" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={updateStatus.isPending}
                        onClick={() =>
                          updateStatus.mutate({
                            id: order.id,
                            status: "RETURNED",
                          })
                        }
                        className="rounded-none text-xs tracking-[0.1em] uppercase"
                      >
                        <RotateCcw className="mr-1 h-3.5 w-3.5" />
                        {t("actions.markReturned")}
                      </Button>
                    )}
                    <span className="ml-auto text-[11px] text-gray-400">
                      {t("actions.restockHint")}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
