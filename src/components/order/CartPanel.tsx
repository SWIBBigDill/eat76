"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
  } = useCart();

  if (itemCount === 0) return null;

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
        />
      </Card>

      {/* Mobile sticky bottom */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-eat-border bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden">
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-eat-ink">
                Cart · {itemCount} item{itemCount !== 1 ? "s" : ""}
              </p>
              <p className="text-lg font-bold text-eat-blue">{formatMoney(total)}</p>
            </div>
            <span className="text-sm text-eat-muted group-open:rotate-180 transition">▼</span>
          </summary>
          <div className="mt-4 max-h-[50vh] overflow-y-auto">
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
              compact
            />
          </div>
        </details>
      </div>
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
  compact,
}: CartContentProps) {
  return (
    <div className={compact ? "" : "space-y-4"}>
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
                className="h-7 w-7 rounded-lg border border-eat-border text-eat-blue"
                onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
              >
                −
              </button>
              <span className="w-4 text-center">{item.quantity}</span>
              <button
                type="button"
                className="h-7 w-7 rounded-lg border border-eat-border text-eat-blue"
                onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
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
              className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${
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

      <div className="flex justify-between border-t border-eat-border pt-3 text-base font-bold">
        <span>Total</span>
        <span className="text-eat-blue">{formatMoney(total)}</span>
      </div>

      <p className="text-xs text-eat-muted leading-relaxed">
        Delivery supports local driver pay. Service keeps Eat76 operating locally. Tips go 100% to your driver.
      </p>

      {/* TODO: Stripe Checkout integration */}
      <Button className="w-full" onClick={() => alert("Demo only — payments coming soon.")}>
        Place Order (Demo)
      </Button>
      <Button variant="ghost" className="w-full text-sm" onClick={clearCart}>
        Clear cart
      </Button>
    </div>
  );
}
