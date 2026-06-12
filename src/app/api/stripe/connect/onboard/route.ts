import { NextResponse } from "next/server";
import { eat76Metadata } from "@/lib/stripe/constants";
import { getStripe, isStripeServerConfigured } from "@/lib/stripe/server";

type OnboardRequest = {
  restaurantId: string;
  businessName: string;
  email?: string;
};

export async function POST(request: Request) {
  if (!isStripeServerConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY." },
      { status: 503 }
    );
  }

  let body: OnboardRequest;
  try {
    body = (await request.json()) as OnboardRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.restaurantId?.trim() || !body.businessName?.trim()) {
    return NextResponse.json(
      { error: "restaurantId and businessName are required." },
      { status: 400 }
    );
  }

  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  try {
    const stripe = getStripe();

    // Accounts v2 — recipient config for destination-charge payouts to restaurants.
    const account = await stripe.v2.core.accounts.create({
      display_name: body.businessName,
      contact_email: body.email,
      identity: {
        country: "US",
        entity_type: "company",
      },
      configuration: {
        recipient: {
          capabilities: {
            stripe_balance: {
              stripe_transfers: { requested: true },
            },
          },
        },
      },
      dashboard: "express",
      defaults: {
        responsibilities: {
          fees_collector: "application",
          losses_collector: "application",
        },
      },
      metadata: eat76Metadata({
        restaurant_id: body.restaurantId,
        role: "restaurant",
      }),
    });

    const accountLink = await stripe.v2.core.accountLinks.create({
      account: account.id,
      use_case: {
        type: "account_onboarding",
        account_onboarding: {
          configurations: ["recipient"],
          return_url: `${origin}/restaurant-dashboard?onboarded=true&account_id=${account.id}`,
          refresh_url: `${origin}/restaurant-dashboard?refresh=true&restaurant_id=${body.restaurantId}`,
        },
      },
    });

    return NextResponse.json({
      accountId: account.id,
      url: accountLink.url,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create Connect onboarding link.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
