import type Stripe from "stripe";
import {
  DELIVERY_FEE,
  RESTAURANT_TIER1_RATE,
  SERVICE_FEE,
} from "@/lib/pricing";
import type { CartItem } from "@/lib/types";
import { eat76Metadata, toCents } from "./constants";

export type CheckoutCartPayload = {
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  tip: number;
  total: number;
  /** v2/core/account id when restaurant has completed Connect onboarding */
  stripeConnectAccountId?: string;
  /** Monthly order count for tiered restaurant fee (defaults to tier 1) */
  restaurantMonthlyOrders?: number;
};

export function calculateRestaurantPlatformFeeCents(
  foodSubtotalCents: number,
  monthlyOrders = 0
): number {
  const rate =
    monthlyOrders <= 150 ? RESTAURANT_TIER1_RATE : 0.12;
  return Math.round(foodSubtotalCents * rate);
}

export function buildCheckoutLineItems(
  payload: CheckoutCartPayload
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
    payload.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          metadata: eat76Metadata({
            menu_item_id: item.menuItemId,
            line_id: item.lineId,
            restaurant_id: payload.restaurantId,
            ...(item.selectedOptions?.length
              ? { options: JSON.stringify(item.selectedOptions) }
              : {}),
          }),
        },
        unit_amount: toCents(item.price),
      },
      quantity: item.quantity,
    }));

  if (payload.serviceFee > 0) {
    lineItems.push(feeLineItem("Eat76 service fee", payload.serviceFee));
  }
  if (payload.deliveryFee > 0) {
    lineItems.push(feeLineItem("Delivery fee", payload.deliveryFee));
  }
  if (payload.tip > 0) {
    lineItems.push(feeLineItem("Driver tip", payload.tip));
  }

  return lineItems;
}

function feeLineItem(name: string, amount: number) {
  return {
    price_data: {
      currency: "usd",
      product_data: {
        name,
        metadata: eat76Metadata(),
      },
      unit_amount: toCents(amount),
    },
    quantity: 1,
  };
}

export function buildConnectPaymentIntentData(
  payload: CheckoutCartPayload
): Stripe.Checkout.SessionCreateParams.PaymentIntentData | undefined {
  const connectAccountId = payload.stripeConnectAccountId?.trim();
  if (!connectAccountId) return undefined;

  const foodSubtotalCents = toCents(payload.subtotal);
  const restaurantFeeCents = calculateRestaurantPlatformFeeCents(
    foodSubtotalCents,
    payload.restaurantMonthlyOrders ?? 0
  );
  const restaurantTransferCents = foodSubtotalCents - restaurantFeeCents;
  const applicationFeeCents =
    toCents(payload.serviceFee) +
    toCents(payload.deliveryFee) +
    restaurantFeeCents +
    toCents(payload.tip);

  return {
    application_fee_amount: applicationFeeCents,
    transfer_data: {
      destination: connectAccountId,
      amount: restaurantTransferCents,
    },
    metadata: eat76Metadata({
      restaurant_id: payload.restaurantId,
      restaurant_name: payload.restaurantName,
      tip_cents: String(toCents(payload.tip)),
      driver_base_cents: String(toCents(6.76)),
    }),
  };
}

/** Validate cart totals match Eat76 pricing rules before creating a session. */
export function validateCheckoutPayload(payload: CheckoutCartPayload): string | null {
  if (!payload.restaurantId || !payload.restaurantName) {
    return "Restaurant is required.";
  }
  if (!payload.items.length) {
    return "Cart is empty.";
  }

  const computedSubtotal = payload.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  if (Math.abs(computedSubtotal - payload.subtotal) > 0.01) {
    return "Subtotal does not match cart items.";
  }

  if (payload.items.length > 0) {
    if (Math.abs(payload.serviceFee - SERVICE_FEE) > 0.01) {
      return "Invalid service fee.";
    }
    if (Math.abs(payload.deliveryFee - DELIVERY_FEE) > 0.01) {
      return "Invalid delivery fee.";
    }
  }

  const expectedTotal =
    payload.subtotal + payload.serviceFee + payload.deliveryFee + payload.tip;
  if (Math.abs(expectedTotal - payload.total) > 0.01) {
    return "Total does not match line items.";
  }

  return null;
}
