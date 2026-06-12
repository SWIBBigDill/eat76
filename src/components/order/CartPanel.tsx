"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CheckoutSavings } from "@/components/order/CheckoutSavings";
import { useCart } from "@/context/CartContext";
import { isStripeClientConfigured } from "@/lib/stripe/client";

const TIP_OPTIONS = [0, 2, 4, 6, 8];

function redirectToUrl(url: string) {
  globalThis.location.assign(url);
}

function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
}

export function CartPanel() {
  const {
    items,
    restaurantId,
    restaurantName,
    subtotal,
    serviceFee,
    deliveryFee,
    tip,
    total,
    setTip,
    updateQuantity,
    clearCart,
    itemCount,
    isCartOpen,
    setCartOpen,
    placeOrder,
    deliveryAddress,
    setDeliveryAddress,
    deliveryAddressValid,
    deliveryAddressError,
  } = useCart();
  const router = useRouter();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const stripeReady = isStripeClientConfigured();

  useEffect(() => {
    if (itemCount === 0) setCartOpen(false);
  }, [itemCount, setCartOpen]);

  if (itemCount === 0) return null;

  async function handlePlaceOrder() {
    setCheckoutError(null);

    if (!deliveryAddressValid) {
      setCheckoutError(deliveryAddressError ?? "Enter a valid delivery address");
      return;
    }

    if (stripeReady && restaurantId && restaurantName) {
      setCheckoutLoading(true);
      try {
        const response = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurantId,
            restaurantName,
            items,
            subtotal,
            serviceFee,
            deliveryFee,
            tip,
            total,
            deliveryAddress,
          }),
        });
        const data = (await response.json()) as { url?: string; error?: string };

        if (response.status === 503 || !response.ok || !data.url) {
          setCheckoutError(data.error ?? "Stripe unavailable. Using demo checkout.");
          placeDemoOrder();
          return;
        }

        redirectToUrl(data.url);
      } catch {
        setCheckoutError("Network error. Placing demo order instead.");
        placeDemoOrder();
      } finally {
        setCheckoutLoading(false);
      }
      return;
    }

    placeDemoOrder();
  }

  function placeDemoOrder() {
    const order = placeOrder();
    if (order) {
      void fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...order,
          status: "placed",
          source: "demo",
          deliveryAddress,
        }),
      }).catch(() => undefined);
      router.push("/order/confirmation");
    }
  }

  const cartProps = {
    items,
    restaurantName,
    subtotal,
    serviceFee,
    deliveryFee,
    tip,
    total,
    setTip,
    updateQuantity,
    clearCart,
    onPlaceOrder: handlePlaceOrder,
    checkoutLoading,
    checkoutError,
    stripeReady,
    deliveryAddress,
    setDeliveryAddress,
    deliveryAddressValid,
    deliveryAddressError,
  };

  return (
    <>
      <Card className="hidden lg:block sticky top-24">
        <CartContent {...cartProps} />
      </Card>

      {isCartOpen && (
        <div className="fixed inset-0 z-[55] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 animate-fade-in"
            aria-label="Close cart"
            onClick={() => setCartOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col animate-slide-up rounded-t-3xl bg-white shadow-2xl safe-bottom">
            <div className="flex shrink-0 justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-eat-border" />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
              <CartContent {...cartProps} compact />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

type CartContentProps = {
  items: ReturnType<typeof useCart>["items"];
  restaurantName: string | null;
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  tip: number;
  total: number;
  setTip: (tip: number) => void;
  updateQuantity: (lineId: string, qty: number) => void;
  clearCart: () => void;
  onPlaceOrder: () => void;
  compact?: boolean;
  checkoutLoading?: boolean;
  checkoutError?: string | null;
  stripeReady?: boolean;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  deliveryAddressValid: boolean;
  deliveryAddressError: string | null;
};

function CartContent({
  items,
  restaurantName,
  subtotal,
  serviceFee,
  deliveryFee,
  tip,
  total,
  setTip,
  updateQuantity,
  clearCart,
  onPlaceOrder,
  compact,
  checkoutLoading,
  checkoutError,
  stripeReady,
  deliveryAddress,
  setDeliveryAddress,
  deliveryAddressValid,
  deliveryAddressError,
}: CartContentProps) {
  return (
    <div className={compact ? "space-y-4" : "space-y-4"}>
      {!compact && (
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-eat-ink">Your cart</h3>
          <span className="rounded-full bg-eat-soft px-2.5 py-1 text-xs font-bold text-eat-blue">
            {items.reduce((n, i) => n + i.quantity, 0)} items
          </span>
        </div>
      )}
      {restaurantName && (
        <p className="text-sm text-eat-muted truncate">From {restaurantName}</p>
      )}

      <div>
        <label htmlFor={compact ? "delivery-address-mobile" : "delivery-address"} className="text-sm font-medium text-eat-ink">
          Delivery address
        </label>
        <input
          id={compact ? "delivery-address-mobile" : "delivery-address"}
          type="text"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          placeholder="Street, city, state, ZIP"
          className={`tap-target mt-2 w-full rounded-xl border px-3 py-2.5 text-sm text-eat-ink placeholder:text-eat-muted focus:outline-none focus:ring-2 focus:ring-eat-blue/20 ${
            deliveryAddressValid
              ? "border-eat-border focus:border-eat-blue"
              : "border-eat-red/50 focus:border-eat-red"
          }`}
        />
        {!deliveryAddressValid && deliveryAddressError && (
          <p className="mt-1 text-xs text-eat-red" role="alert">
            {deliveryAddressError}
          </p>
        )}
        {deliveryAddressValid && (
          <p className="mt-1 text-xs text-eat-muted">Delivering in your zone</p>
        )}
      </div>

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.lineId} className="flex items-center justify-between gap-2 text-sm">
            <span className="min-w-0 flex-1">
              <span className="line-clamp-2">{item.name}</span>
              {item.optionSummary && item.name.includes("·") === false && (
                <span className="mt-0.5 block text-xs text-eat-muted line-clamp-1">
                  {item.optionSummary}
                </span>
              )}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                className="tap-target h-9 w-9 rounded-xl border border-eat-border text-eat-blue transition active:bg-eat-soft"
                onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                aria-label={`Decrease ${item.name}`}
              >
                −
              </button>
              <span className="w-5 text-center font-medium">{item.quantity}</span>
              <button
                type="button"
                className="tap-target h-9 w-9 rounded-xl border border-eat-border text-eat-blue transition active:bg-eat-soft"
                onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                aria-label={`Increase ${item.name}`}
              >
                +
              </button>
              <span className="w-14 text-right font-medium">
                {formatMoney(item.price * item.quantity)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className="space-y-1.5 border-t border-eat-border pt-3 text-sm">
        <div className="flex justify-between">
          <span className="text-eat-muted">Food subtotal</span>
          <span>{formatMoney(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-eat-muted">Service fee</span>
          <span>{formatMoney(serviceFee)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-eat-muted">Delivery fee</span>
          <span>{formatMoney(deliveryFee)}</span>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-eat-ink">Tip your driver</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {TIP_OPTIONS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setTip(amount)}
              className={`tap-target rounded-xl px-4 py-2 text-sm font-semibold transition ${
                tip === amount
                  ? "bg-eat-red text-white"
                  : "border border-eat-border text-eat-ink hover:bg-eat-soft"
              }`}
            >
              {amount === 0 ? "No tip" : `$${amount}`}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-eat-muted">100% of tips go to your driver.</p>
      </div>

      <CheckoutSavings foodSubtotal={subtotal} tip={tip} compact={compact} />

      <div className="flex justify-between border-t border-eat-border pt-3 text-base font-bold">
        <span>Total</span>
        <span className="text-eat-blue">{formatMoney(total)}</span>
      </div>

      <p className="text-xs text-eat-muted leading-relaxed">
        Delivery supports local driver pay. Service keeps Eat76 operating locally. Tips go 100% to your driver.
      </p>

      {checkoutError && (
        <p className="text-xs text-eat-red" role="alert">
          {checkoutError}
        </p>
      )}

      <Button
        className="w-full tap-target"
        onClick={onPlaceOrder}
        disabled={checkoutLoading || !deliveryAddressValid}
      >
        {checkoutLoading
          ? "Redirecting to checkout…"
          : stripeReady
            ? "Pay with Stripe"
            : "Place Order (Demo)"}
      </Button>
      <Button variant="ghost" className="w-full text-sm tap-target" onClick={clearCart}>
        Clear cart
      </Button>
    </div>
  );
}
