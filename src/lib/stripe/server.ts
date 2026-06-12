import Stripe from "stripe";
import { EAT76_BUSINESS_NAME } from "./constants";
import { isStripeEnabled } from "./config";

let stripeClient: Stripe | null = null;

export function isStripeServerConfigured(): boolean {
  return isStripeEnabled() && Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add keys to .env.local or use demo checkout mode."
    );
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      appInfo: {
        name: EAT76_BUSINESS_NAME,
        version: "0.1.0",
      },
    });
  }

  return stripeClient;
}
