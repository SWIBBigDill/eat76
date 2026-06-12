import { NextResponse } from "next/server";
import {
  buildCheckoutLineItems,
  buildConnectPaymentIntentData,
  validateCheckoutPayload,
  type CheckoutCartPayload,
} from "@/lib/stripe/checkout";
import { eat76Metadata } from "@/lib/stripe/constants";
import { getStripe, isStripeServerConfigured } from "@/lib/stripe/server";

export async function POST(request: Request) {
  if (!isStripeServerConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY." },
      { status: 503 }
    );
  }

  let payload: CheckoutCartPayload;
  try {
    payload = (await request.json()) as CheckoutCartPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const validationError = validateCheckoutPayload(payload);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  try {
    const stripe = getStripe();
    const paymentIntentData = buildConnectPaymentIntentData(payload);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: buildCheckoutLineItems(payload),
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/order/${payload.restaurantId}`,
      metadata: eat76Metadata({
        restaurant_id: payload.restaurantId,
        restaurant_name: payload.restaurantName,
        tip: String(payload.tip),
        food_subtotal: String(payload.subtotal),
      }),
      ...(paymentIntentData ? { payment_intent_data: paymentIntentData } : {}),
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Checkout session missing redirect URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create checkout session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
