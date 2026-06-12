import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { orderFromStripeSession, saveOrder } from "@/lib/store/orders";
import { getStripe, isStripeServerConfigured } from "@/lib/stripe/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isStripeServerConfigured()) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not set." },
      { status: 503 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const body = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook signature verification failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata ?? {};

      const order = orderFromStripeSession({
        sessionId: session.id,
        metadata,
        amountTotal: session.amount_total,
      });

      try {
        // Swap to Supabase: await supabase.from('orders').insert(order)
        await saveOrder(order);
        console.info("[eat76/stripe] order saved", {
          orderId: order.id,
          restaurantId: order.restaurantId,
        });
      } catch (err) {
        console.error("[eat76/stripe] failed to persist order", err);
      }
      break;
    }
    case "account.updated": {
      const account = event.data.object as Stripe.Account;
      // TODO: sync restaurant Connect onboarding status
      console.info("[eat76/stripe] account.updated", { accountId: account.id });
      break;
    }
    default:
      console.info("[eat76/stripe] unhandled event", event.type);
  }

  return NextResponse.json({ received: true });
}
