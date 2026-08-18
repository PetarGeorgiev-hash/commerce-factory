import "server-only";
import nodemailer from "nodemailer";
import { env } from "@/env";
import type { DeliveryType, Order, OrderItem } from "../../../generated/prisma";

type OrderWithItems = Order & { items: OrderItem[] };
type Locale = "en" | "bg";

const DELIVERY_LABELS: Record<Locale, Record<DeliveryType, string>> = {
  en: {
    ADDRESS: "Delivery to address",
    SPEEDY_OFFICE: "Speedy office",
    ECONT_OFFICE: "Econt office",
  },
  bg: {
    ADDRESS: "Доставка до адрес",
    SPEEDY_OFFICE: "Офис на Speedy",
    ECONT_OFFICE: "Офис на Econt",
  },
};

const CUSTOMER_STRINGS: Record<
  Locale,
  {
    subject: (n: number) => string;
    eyebrow: string;
    title: string;
    intro: string;
    codNote: string;
    total: string;
    customer: string;
    delivery: string;
    note: string;
    footer: string;
  }
> = {
  en: {
    subject: (n) => `Order #${n} confirmed — we're working on it`,
    eyebrow: "Thank you",
    title: "Your order has been received",
    intro:
      "We are already working on your order. We will contact you by phone or email to confirm the delivery.",
    codNote:
      "Payment: cash on delivery — pay the courier when your order arrives.",
    total: "Total",
    customer: "Contact",
    delivery: "Delivery",
    note: "Note",
    footer:
      "If anything in this order looks wrong, just reply to this email.",
  },
  bg: {
    subject: (n) => `Поръчка №${n} е приета — вече работим по нея`,
    eyebrow: "Благодарим ви",
    title: "Вашата поръчка е приета",
    intro:
      "Вече работим по вашата поръчка. Ще се свържем с вас по телефон или имейл, за да потвърдим доставката.",
    codNote:
      "Плащане: наложен платеж — плащате на куриера при получаване.",
    total: "Общо",
    customer: "Контакт",
    delivery: "Доставка",
    note: "Бележка",
    footer:
      "Ако нещо в поръчката не е наред, просто отговорете на този имейл.",
  },
};

function formatPrice(value: number) {
  return `€${value.toFixed(2)}`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function itemsTable(
  order: OrderWithItems,
  totalLabel: string,
  discountLabel: string,
) {
  const rows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #eeece8;">
            ${
              item.image
                ? `<img src="${escapeHtml(item.image)}" alt="" width="56" height="70" style="display:block;object-fit:cover;background:#f5f4f0;" />`
                : `<div style="width:56px;height:70px;background:#f5f4f0;"></div>`
            }
          </td>
          <td style="padding:14px 12px;border-bottom:1px solid #eeece8;font-size:13px;color:#1a1a1a;">
            ${escapeHtml(item.title)}<br />
            <span style="color:#888;font-size:12px;">
              ${escapeHtml([item.color, item.sizeLabel].filter(Boolean).join(" / "))} × ${item.qty}
            </span>
          </td>
          <td align="right" style="padding:14px 0;border-bottom:1px solid #eeece8;font-size:13px;color:#1a1a1a;white-space:nowrap;">
            ${formatPrice(item.price * item.qty)}
          </td>
        </tr>`,
    )
    .join("");

  const discountRow =
    order.discount > 0
      ? `<tr>
          <td colspan="2" style="padding:14px 0 0;font-size:12px;color:#888;">
            ${escapeHtml(discountLabel)}${order.promoCodeText ? ` (${escapeHtml(order.promoCodeText)})` : ""}
          </td>
          <td align="right" style="padding:14px 0 0;font-size:13px;color:#1a1a1a;">
            −${formatPrice(order.discount)}
          </td>
        </tr>`
      : "";

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #eeece8;">
      ${rows}
      ${discountRow}
      <tr>
        <td colspan="2" style="padding:16px 0;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#1a1a1a;font-weight:600;">
          ${escapeHtml(totalLabel)}
        </td>
        <td align="right" style="padding:16px 0;font-size:15px;color:#1a1a1a;">
          ${formatPrice(order.subtotal - order.discount)}
        </td>
      </tr>
    </table>`;
}

function detailsBlock(
  order: OrderWithItems,
  locale: Locale,
  labels: { customer: string; delivery: string; note: string },
) {
  const deliveryLines = [
    DELIVERY_LABELS[locale][order.deliveryType],
    [order.postalCode, order.city].filter(Boolean).join(" "),
    order.address,
  ]
    .filter(Boolean)
    .map((line) => escapeHtml(String(line)))
    .join("<br />");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f4f0;">
      <tr>
        <td style="padding:20px;font-size:13px;line-height:1.7;color:#1a1a1a;vertical-align:top;">
          <span style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#999;">${escapeHtml(labels.customer)}</span><br />
          ${escapeHtml(`${order.firstName} ${order.lastName}`)}<br />
          ${escapeHtml(order.email)}<br />
          ${escapeHtml(order.phone)}
        </td>
        <td style="padding:20px;font-size:13px;line-height:1.7;color:#1a1a1a;vertical-align:top;">
          <span style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#999;">${escapeHtml(labels.delivery)}</span><br />
          ${deliveryLines}
        </td>
      </tr>
      ${
        order.note
          ? `<tr><td colspan="2" style="padding:0 20px 20px;font-size:13px;color:#555;"><span style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#999;">${escapeHtml(labels.note)}</span><br />${escapeHtml(order.note)}</td></tr>`
          : ""
      }
    </table>`;
}

function shell(inner: string) {
  return `
  <div style="margin:0;padding:32px 16px;background:#f5f4f0;font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;">
      ${inner}
    </table>
  </div>`;
}

function adminEmailHtml(order: OrderWithItems) {
  return shell(`
      <tr>
        <td style="padding:32px 32px 24px;">
          <p style="margin:0;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#999;">
            SeventySaints
          </p>
          <h1 style="margin:8px 0 0;font-size:24px;font-weight:300;color:#1a1a1a;">
            New order #${order.orderNumber}
          </h1>
          <p style="margin:6px 0 0;font-size:13px;color:#888;">
            ${order.createdAt.toLocaleString("en-GB", { timeZone: "Europe/Sofia" })} · Cash on delivery
          </p>
        </td>
      </tr>
      <tr><td style="padding:0 32px;">${itemsTable(order, "Total", "Discount")}</td></tr>
      <tr>
        <td style="padding:8px 32px 32px;">
          ${detailsBlock(order, "en", { customer: "Customer", delivery: "Delivery", note: "Note" })}
        </td>
      </tr>`);
}

function customerEmailHtml(order: OrderWithItems, locale: Locale) {
  const s = CUSTOMER_STRINGS[locale];
  return shell(`
      <tr>
        <td style="padding:32px 32px 24px;">
          <p style="margin:0;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#999;">
            ${escapeHtml(s.eyebrow)}
          </p>
          <h1 style="margin:8px 0 0;font-size:24px;font-weight:300;color:#1a1a1a;">
            ${escapeHtml(s.title)} — #${order.orderNumber}
          </h1>
          <p style="margin:12px 0 0;font-size:13px;line-height:1.7;color:#555;">
            ${escapeHtml(s.intro)}
          </p>
          <p style="margin:8px 0 0;font-size:13px;line-height:1.7;color:#555;">
            ${escapeHtml(s.codNote)}
          </p>
        </td>
      </tr>
      <tr><td style="padding:0 32px;">${itemsTable(order, s.total, locale === "bg" ? "Отстъпка" : "Discount")}</td></tr>
      <tr>
        <td style="padding:8px 32px 24px;">
          ${detailsBlock(order, locale, { customer: s.customer, delivery: s.delivery, note: s.note })}
        </td>
      </tr>
      <tr>
        <td style="padding:0 32px 32px;">
          <p style="margin:0;font-size:12px;color:#999;">${escapeHtml(s.footer)}</p>
        </td>
      </tr>`);
}

function getTransporter() {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT ?? 587,
    secure: (env.SMTP_PORT ?? 587) === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
}

/**
 * Sends the "new order" emails: a notification to the shop admin and a
 * confirmation to the customer. Never throws — failed emails must not break
 * a successfully placed order.
 */
export async function sendOrderEmails(order: OrderWithItems, locale: Locale) {
  const transporter = getTransporter();
  const adminTo = env.ORDER_NOTIFICATION_EMAIL ?? env.SMTP_USER;
  if (!transporter || !adminTo) {
    console.warn(
      `[email] SMTP not configured — skipping emails for order #${order.orderNumber}`,
    );
    return;
  }

  const from = `"SeventySaints" <${env.SMTP_USER}>`;

  const send = (label: string, mail: Parameters<typeof transporter.sendMail>[0]) =>
    transporter.sendMail(mail).catch((error: unknown) => {
      console.error(
        `[email] Failed to send ${label} email for order #${order.orderNumber}`,
        error,
      );
    });

  await Promise.all([
    send("admin", {
      from,
      to: adminTo,
      replyTo: order.email,
      subject: `New order #${order.orderNumber} — ${order.firstName} ${order.lastName} (${formatPrice(order.subtotal)})`,
      html: adminEmailHtml(order),
    }),
    send("customer", {
      from,
      to: order.email,
      replyTo: adminTo,
      subject: CUSTOMER_STRINGS[locale].subject(order.orderNumber),
      html: customerEmailHtml(order, locale),
    }),
  ]);
}
