"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Check, ChevronDown, Truck, Package } from "lucide-react";
import { api } from "@/trpc/react";
import { useCart, formatPrice } from "@/components/Cart/CartContext";
import { ROUTES } from "@/lib/constants/routes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type DeliveryType = "ADDRESS" | "SPEEDY_OFFICE" | "ECONT_OFFICE";

type PlacedOrder = { orderNumber: number; email: string };

type FieldName =
  | "email"
  | "phone"
  | "firstName"
  | "lastName"
  | "city"
  | "address";

const EMAIL_RE = /^\S+@\S+\.\S+$/;
// digits, spaces, dashes, parens, optional leading +; server requires 6-30 chars
const PHONE_RE = /^\+?[\d\s\-()]{6,30}$/;

type AppliedPromo = { code: string; type: "PERCENT" | "AMOUNT"; value: number };

function promoDiscount(promo: AppliedPromo | null, subtotal: number) {
  if (!promo) return 0;
  const raw =
    promo.type === "PERCENT" ? (subtotal * promo.value) / 100 : promo.value;
  return Math.min(Math.round(raw * 100) / 100, subtotal);
}

export default function CheckoutForm() {
  const t = useTranslations("Checkout");
  const { items, subtotal, clearCart, removeBySizeId } = useCart();

  const [deliveryType, setDeliveryType] = useState<DeliveryType>("ADDRESS");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<FieldName, string>>
  >({});
  const [promo, setPromo] = useState<AppliedPromo | null>(null);

  function clearFieldError(name: FieldName) {
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  const createOrder = api.order.create.useMutation({
    onSuccess: (data, variables) => {
      setPlacedOrder({ orderNumber: data.orderNumber, email: variables.email });
      clearCart();
      window.scrollTo({ top: 0 });
    },
    onError: (error) => {
      const message = error.message;
      if (message.startsWith("OUT_OF_STOCK:")) {
        const [, sizeId, itemName] = message.split(":");
        if (sizeId) removeBySizeId(sizeId);
        toast.error(t("errors.outOfStock", { item: itemName ?? "" }));
      } else if (message === "PRODUCT_UNAVAILABLE") {
        toast.error(t("errors.unavailable"));
      } else if (message === "INVALID_PROMO") {
        // The code was deleted/deactivated between applying and submitting.
        setPromo(null);
        toast.error(t("promo.invalid"));
      } else if (error.data?.zodError) {
        // Server-side validation caught something the client missed.
        toast.error(t("errors.required"));
      } else {
        toast.error(t("errors.generic"));
      }
    },
  });

  if (placedOrder) {
    return <OrderConfirmation order={placedOrder} />;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6 px-4 py-24 text-center">
        <p className="text-sm text-[#888]">{t("emptyBag")}</p>
        <Link
          href={ROUTES.SHOP}
          className="inline-block bg-[#1a1a1a] px-8 py-3.5 text-[12px] font-semibold tracking-[0.2em] text-white uppercase transition hover:bg-[#333]"
        >
          {t("backToShop")}
        </Link>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const value = (name: string) =>
      (data.get(name) as string | null)?.trim() ?? "";

    const email = value("email");
    const phone = value("phone");
    const firstName = value("firstName");
    const lastName = value("lastName");
    const city = value("city");
    const address = value("address");

    const errors: Partial<Record<FieldName, string>> = {};
    if (!email) errors.email = t("errors.fieldRequired");
    else if (!EMAIL_RE.test(email)) errors.email = t("errors.invalidEmail");
    if (!phone) errors.phone = t("errors.fieldRequired");
    else if (!PHONE_RE.test(phone)) errors.phone = t("errors.invalidPhone");
    if (!firstName) errors.firstName = t("errors.fieldRequired");
    if (!lastName) errors.lastName = t("errors.fieldRequired");
    if (!city) errors.city = t("errors.fieldRequired");
    if (!address) errors.address = t("errors.fieldRequired");

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error(t("errors.required"));
      const firstInvalid = Object.keys(errors)[0];
      form
        .querySelector<HTMLInputElement>(`#${firstInvalid}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    createOrder.mutate({
      email,
      phone,
      firstName,
      lastName,
      city,
      address,
      deliveryType,
      postalCode: value("postalCode") ?? undefined,
      note: value("note") ?? undefined,
      promoCode: promo?.code,
      items: items.map((i) => ({ sizeId: i.sizeId, qty: i.qty })),
    });
  }

  const isAddress = deliveryType === "ADDRESS";

  return (
    <div className="mx-auto w-full max-w-6xl lg:grid lg:grid-cols-[1fr_440px]">
      {/* Mobile order summary (collapsible, checkout style) */}
      <div className="border-b border-[#e0deda] lg:hidden">
        <button
          type="button"
          onClick={() => setSummaryOpen((o) => !o)}
          className="flex w-full items-center justify-between px-4 py-4 text-[13px]"
          aria-expanded={summaryOpen}
        >
          <span className="flex items-center gap-1.5 text-[#555]">
            {t("summary.title")}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${summaryOpen ? "rotate-180" : ""}`}
            />
          </span>
          <span className="font-medium">{formatPrice(subtotal)} EUR</span>
        </button>
        {summaryOpen && (
          <div className="px-4 pb-6">
            <OrderSummary promo={promo} setPromo={setPromo} />
          </div>
        )}
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="px-4 py-8 sm:px-6 lg:border-r lg:border-[#e0deda] lg:px-12 lg:py-12"
      >
        <p className="text-[11px] tracking-[0.25em] text-[#999] uppercase">
          {t("eyebrow")}
        </p>
        <h1 className="mt-1 mb-8 text-3xl font-light tracking-tight">
          {t("title")}
        </h1>

        {/* Contact */}
        <SectionTitle>{t("contact.title")}</SectionTitle>
        <div className="space-y-4">
          <Field
            name="email"
            type="email"
            label={t("contact.email")}
            autoComplete="email"
            required
            error={fieldErrors.email}
            onChange={() => clearFieldError("email")}
          />
          <Field
            name="phone"
            type="tel"
            label={t("contact.phone")}
            placeholder={t("contact.phonePlaceholder")}
            autoComplete="tel"
            required
            error={fieldErrors.phone}
            onChange={() => clearFieldError("phone")}
          />
        </div>

        {/* Delivery method */}
        <SectionTitle className="mt-10">{t("delivery.title")}</SectionTitle>
        <div
          role="radiogroup"
          className="divide-y divide-[#e0deda] border border-[#e0deda]"
        >
          <DeliveryOption
            selected={deliveryType === "ADDRESS"}
            onSelect={() => setDeliveryType("ADDRESS")}
            icon={<Truck className="h-4 w-4" />}
            label={t("delivery.address")}
            description={t("delivery.addressDescription")}
          />
          <DeliveryOption
            selected={deliveryType === "SPEEDY_OFFICE"}
            onSelect={() => setDeliveryType("SPEEDY_OFFICE")}
            icon={<Package className="h-4 w-4" />}
            label={t("delivery.speedy")}
            description={t("delivery.speedyDescription")}
          />
          <DeliveryOption
            selected={deliveryType === "ECONT_OFFICE"}
            onSelect={() => setDeliveryType("ECONT_OFFICE")}
            icon={<Package className="h-4 w-4" />}
            label={t("delivery.econt")}
            description={t("delivery.econtDescription")}
          />
        </div>

        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              name="firstName"
              label={t("delivery.firstName")}
              autoComplete="given-name"
              required
              error={fieldErrors.firstName}
              onChange={() => clearFieldError("firstName")}
            />
            <Field
              name="lastName"
              label={t("delivery.lastName")}
              autoComplete="family-name"
              required
              error={fieldErrors.lastName}
              onChange={() => clearFieldError("lastName")}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_140px]">
            <Field
              name="city"
              label={t("delivery.city")}
              autoComplete="address-level2"
              required
              error={fieldErrors.city}
              onChange={() => clearFieldError("city")}
            />
            <Field
              name="postalCode"
              label={t("delivery.postalCode")}
              autoComplete="postal-code"
              inputMode="numeric"
            />
          </div>
          <Field
            key={deliveryType}
            name="address"
            label={isAddress ? t("delivery.addressLabel") : t("delivery.officeLabel")}
            placeholder={
              isAddress
                ? t("delivery.addressPlaceholder")
                : t("delivery.officePlaceholder")
            }
            autoComplete={isAddress ? "street-address" : "off"}
            required
            error={fieldErrors.address}
            onChange={() => clearFieldError("address")}
          />
          <div className="space-y-1.5">
            <Label
              htmlFor="note"
              className="text-[11px] tracking-[0.15em] text-[#777] uppercase"
            >
              {t("delivery.note")}
            </Label>
            <Textarea
              id="note"
              name="note"
              rows={3}
              maxLength={500}
              placeholder={t("delivery.notePlaceholder")}
              className="rounded-none border-[#d5d3cf] bg-white text-[14px] focus-visible:border-[#1a1a1a] focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Payment */}
        <SectionTitle className="mt-10">{t("payment.title")}</SectionTitle>
        <div className="border border-[#e0deda] bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1a1a1a]">
              <Check className="h-3 w-3 text-white" />
            </span>
            <p className="text-[14px]">{t("payment.cod")}</p>
          </div>
          <p className="mt-2 pl-8 text-[12px] leading-relaxed text-[#888]">
            {t("payment.codDescription")}
          </p>
        </div>

        <button
          type="submit"
          disabled={createOrder.isPending}
          className="mt-10 w-full bg-[#1a1a1a] py-4 text-[12px] font-semibold tracking-[0.25em] text-white uppercase transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {createOrder.isPending ? t("submitting") : t("submit")}
        </button>
      </form>

      {/* Desktop order summary */}
      <aside className="hidden lg:block">
        <div className="sticky top-0 px-10 py-12">
          <OrderSummary promo={promo} setPromo={setPromo} />
        </div>
      </aside>
    </div>
  );
}

function SectionTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`mb-4 text-[13px] font-semibold tracking-[0.2em] uppercase ${className}`}
    >
      {children}
    </h2>
  );
}

function Field({
  label,
  name,
  error,
  ...props
}: {
  label: string;
  name: string;
  error?: string;
} & React.ComponentProps<typeof Input>) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={name}
        className="text-[11px] tracking-[0.15em] text-[#777] uppercase"
      >
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        aria-invalid={!!error}
        className={`h-11 rounded-none bg-white text-[14px] focus-visible:ring-0 ${
          error
            ? "border-red-600 focus-visible:border-red-600"
            : "border-[#d5d3cf] focus-visible:border-[#1a1a1a]"
        }`}
        {...props}
      />
      {error && <p className="text-[12px] text-red-600">{error}</p>}
    </div>
  );
}

function DeliveryOption({
  selected,
  onSelect,
  icon,
  label,
  description,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex w-full items-center gap-4 p-4 text-left transition ${
        selected ? "bg-white" : "bg-transparent hover:bg-white/60"
      }`}
    >
      <span
        className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border transition ${
          selected ? "border-[#1a1a1a]" : "border-[#bbb]"
        }`}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-[#1a1a1a]" />}
      </span>
      <span className="flex-1">
        <span className="block text-[14px]">{label}</span>
        <span className="block text-[12px] text-[#888]">{description}</span>
      </span>
      <span className="text-[#888]">{icon}</span>
    </button>
  );
}

function OrderSummary({
  promo,
  setPromo,
}: {
  promo: AppliedPromo | null;
  setPromo: (promo: AppliedPromo | null) => void;
}) {
  const t = useTranslations("Checkout.summary");
  const { items, subtotal } = useCart();
  const discount = promoDiscount(promo, subtotal);

  return (
    <div>
      <div className="space-y-5">
        {items.map((item) => (
          <div key={item.key} className="flex items-center gap-4">
            <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-white">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              )}
              <span className="absolute -top-0 -right-0 flex h-5 min-w-5 items-center justify-center bg-[#1a1a1a] px-1 text-[10px] text-white">
                {item.qty}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{item.title}</p>
              <p className="text-[12px] text-[#888]">
                {[item.color, item.size].filter(Boolean).join(" / ")}
              </p>
            </div>
            <p className="shrink-0 text-sm">
              {formatPrice(item.price * item.qty)}
            </p>
          </div>
        ))}
      </div>

      <PromoBox promo={promo} setPromo={setPromo} />

      <div className="mt-6 space-y-2.5 border-t border-[#e0deda] pt-5 text-[13px]">
        <div className="flex justify-between">
          <span className="text-[#777]">{t("subtotal")}</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && promo && (
          <div className="flex justify-between">
            <span className="text-[#777]">
              {t("discount")} ({promo.code})
            </span>
            <span className="text-emerald-700">−{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-[#777]">{t("shipping")}</span>
          <span className="text-[#888]">{t("shippingValue")}</span>
        </div>
        <div className="flex items-center justify-between pt-2 text-[15px]">
          <span className="font-semibold tracking-[0.15em] uppercase">
            {t("total")}
          </span>
          <span>{formatPrice(subtotal - discount)} EUR</span>
        </div>
      </div>
    </div>
  );
}

function PromoBox({
  promo,
  setPromo,
}: {
  promo: AppliedPromo | null;
  setPromo: (promo: AppliedPromo | null) => void;
}) {
  const t = useTranslations("Checkout.promo");
  const utils = api.useUtils();
  const [input, setInput] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function apply() {
    const code = input.trim();
    if (!code || checking) return;
    setChecking(true);
    setError(null);
    try {
      const result = await utils.promo.validate.fetch({ code });
      if (!result) {
        setError(t("invalid"));
      } else {
        setPromo(result);
        setInput("");
      }
    } catch {
      setError(t("invalid"));
    } finally {
      setChecking(false);
    }
  }

  if (promo) {
    return (
      <div className="mt-6 flex items-center justify-between border border-[#e0deda] bg-white px-3 py-2.5 text-[13px]">
        <span>{t("applied", { code: promo.code })}</span>
        <button
          type="button"
          onClick={() => setPromo(null)}
          className="text-[#888] underline-offset-2 transition hover:text-[#1a1a1a] hover:underline"
        >
          {t("remove")}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => {
            setInput(e.target.value.toUpperCase());
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void apply();
            }
          }}
          placeholder={t("placeholder")}
          aria-label={t("label")}
          maxLength={30}
          className="h-10 rounded-none border-[#d5d3cf] bg-white text-[13px] uppercase focus-visible:border-[#1a1a1a] focus-visible:ring-0"
        />
        <button
          type="button"
          onClick={() => void apply()}
          disabled={checking || !input.trim()}
          className="shrink-0 bg-[#1a1a1a] px-5 text-[11px] font-semibold tracking-[0.15em] text-white uppercase transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {checking ? t("checking") : t("apply")}
        </button>
      </div>
      {error && <p className="mt-1.5 text-[12px] text-red-600">{error}</p>}
    </div>
  );
}

function OrderConfirmation({ order }: { order: PlacedOrder }) {
  const t = useTranslations("Checkout.success");

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#1a1a1a]">
        <Check className="h-6 w-6" />
      </span>
      <p className="mt-8 text-[11px] tracking-[0.25em] text-[#999] uppercase">
        {t("eyebrow")}
      </p>
      <h1 className="mt-2 text-3xl font-light tracking-tight">{t("title")}</h1>
      <p className="mt-4 max-w-md text-[14px] leading-relaxed text-[#666]">
        {t("message", { number: order.orderNumber, email: order.email })}
      </p>
      <Link
        href={ROUTES.SHOP}
        className="mt-10 inline-block bg-[#1a1a1a] px-10 py-4 text-[12px] font-semibold tracking-[0.25em] text-white uppercase transition hover:bg-[#333]"
      >
        {t("continueShopping")}
      </Link>
    </div>
  );
}
