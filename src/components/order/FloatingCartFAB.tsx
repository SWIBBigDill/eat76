"use client";

import { useCart } from "@/context/CartContext";

function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
}

export function FloatingCartFAB() {
  const { itemCount, total, cartPulse, setCartOpen } = useCart();

  if (itemCount === 0) return null;

  return (
    <button
      type="button"
      onClick={() => setCartOpen(true)}
      className="fixed right-4 z-40 flex items-center gap-3 rounded-full bg-eat-red px-5 py-3.5 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 tap-target bottom-[calc(4.5rem+env(safe-area-inset-bottom))] lg:bottom-6"
      aria-label={`Open cart, ${itemCount} items, ${formatMoney(total)}`}
    >
      <span className="relative">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <span
          className={`absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-eat-red ${
            cartPulse ? "animate-cart-pulse" : ""
          }`}
        >
          {itemCount}
        </span>
      </span>
      <span className="text-sm font-bold">{formatMoney(total)}</span>
    </button>
  );
}
