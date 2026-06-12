"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CheckoutSavings } from "@/components/order/CheckoutSavings";
import { useCart } from "@/context/CartContext";

const TIP_OPTIONS = [0, 2, 4, 6, 8];

function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
}

export function CartPanel() {
  const {
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
    itemCount,
    isCartOpen,
    setCartOpen,
    placeOrder,
  } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (itemCount === 0) setCartOpen(false);
  }, [itemCount, setCartOpen]);

  if (itemCount === 0) return null;

  function handlePlaceOrder() {
    const order = placeOrder();
    if (order) router.push("/order/confirmation");
  }

  return (
    <>
      {/* Desktop sidebar */}
      <Card className="hidden lg:block sticky top-24">
        <CartContent
          items={items}
          restaurantName={restaurantName}
          subtotal={subtotal}
          serviceFee={serviceFee}
          deliveryFee={deliveryFee}
          tip={tip}
          total={total}
          setTip={setTip}
          updateQuantity={updateQuantity}
          clearCart={clearCart}
          onPlaceOrder={handlePlaceOrder}
        />
      </Card>

      {/* Mobile slide-up sheet */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 animate-fade-in"
            aria-label="Close cart"
            onClick={() => setCartOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] animate-slide-up rounded-t-3xl bg-white shadow-2xl safe-bottom">
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-eat-border" />
            </div>
            <div className="overflow-y-auto px-4 pb-6 max-h-[calc(85vh-2rem)]">
              <CartContent
                items={items}
                restaurantName={restaurantName}
                subtotal={subtotal}
                serviceFee={serviceFee}
                deliveryFee={deliveryFee}
                tip={tip}
                total={total}
                setTip={setTip}
                updateQuantity={updateQuantity}
                clearCart={clearCart}
                onPlaceOrder={handlePlaceOrder}
                compact
              />
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
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  onPlaceOrder: () => void;
  compact?: boolean;
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
}: CartContentProps) {
  return (
    <div className={compact ? "space-y-4" : "space-y-4"}>
      {!compact && (
        <h3 className="text-lg font-bold text-eat-ink">Your cart</h3>
      )}
      {restaurantName && (
        <p className="text-sm text-eat-muted">From {restaurantName}</p>
      )}

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.menuItemId} className="flex items-center justify-between gap-2 text-sm">
            <span className="min-w-0 flex-1 truncate">{item.name}</span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                className="tap-target h-9 w-9 rounded-xl border border-eat-border text-eat-blue transition active:bg-eat-soft"
                onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                aria-label={`Decrease ${item.name}`}
              >
                −
              </button>
              <span className="w-5 text-center font-medium">{item.quantity}</span>
              <button
                type="button"
                className="tap-target h-9 w-9 rounded-xl border border-eat-border text-eat-blue transition active:bg-eat-soft"
                onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
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

      <Button className="w-full tap-target" onClick={onPlaceOrder}>
        Place Order (Demo)
      </Button>
      <Button variant="ghost" className="w-full text-sm tap-target" onClick={clearCart}>
        Clear cart
      </Button>
    </div>
  );
}
