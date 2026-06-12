import type { StoredOrder } from "@/lib/store/orders";

/**
 * Transactional email via Resend. No-ops unless RESEND_API_KEY is set, so the
 * app works without email configured.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function fromAddress(): string {
  return process.env.NOTIFY_FROM_EMAIL ?? "Eat76 <onboarding@resend.dev>";
}

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!isEmailConfigured()) return;
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: fromAddress(), to: [to], subject, html }),
    });
    if (!res.ok) {
      console.error("[email] send failed:", res.status, await res.text());
    }
  } catch (error) {
    console.error("[email] send error:", error);
  }
}

function money(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function trackUrl(orderId: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://eat76.vercel.app";
  return `${base}/order/track/${orderId}`;
}

export async function sendOrderConfirmationEmail(order: StoredOrder): Promise<void> {
  if (!order.customerEmail) return;
  const itemsHtml = order.items
    .map((i) => `<li>${i.quantity}× ${i.name} - ${money(i.price * i.quantity)}</li>`)
    .join("");
  await sendEmail(
    order.customerEmail,
    `Eat76 order confirmed - ${order.restaurantName}`,
    `<h2>Thanks for your order!</h2>
     <p>${order.restaurantName} received your order <strong>${order.id}</strong>.</p>
     <ul>${itemsHtml}</ul>
     <p><strong>Total: ${money(order.total)}</strong></p>
     <p><a href="${trackUrl(order.id)}">Track your order live</a></p>
     <p>Eat76 - Local delivery that keeps money in 19348.</p>`
  );
}

const STATUS_EMAIL: Partial<Record<string, { subject: string; line: string }>> = {
  on_the_way: {
    subject: "Your Eat76 order is on the way",
    line: "Your driver is headed to your door now.",
  },
  delivered: {
    subject: "Your Eat76 order was delivered",
    line: "Your order was delivered. Enjoy your meal!",
  },
};

export async function sendOrderStatusEmail(
  order: StoredOrder,
  status: string
): Promise<void> {
  if (!order.customerEmail) return;
  const content = STATUS_EMAIL[status];
  if (!content) return;
  await sendEmail(
    order.customerEmail,
    content.subject,
    `<h2>${content.line}</h2>
     <p>Order <strong>${order.id}</strong> from ${order.restaurantName}.</p>
     <p><a href="${trackUrl(order.id)}">View order</a></p>`
  );
}
