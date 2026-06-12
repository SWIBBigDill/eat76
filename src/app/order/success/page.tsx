"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { PlacedOrder } from "@/context/CartContext";
import { loadLastOrder } from "@/lib/order-tracking";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");
  const [order, setOrder] = useState<PlacedOrder | null>(null);

  useEffect(() => {
    const last = loadLastOrder();
    if (last) {
      setOrder(last);
      return;
    }
    if (orderId) {
      setOrder({
        id: orderId,
        restaurantId: "",
        restaurantName: "Your restaurant",
        items: [],
        subtotal: 0,
        serviceFee: 1.76,
        deliveryFee: 4.76,
        tip: 0,
        total: 0,
        savings: 0,
        placedAt: new Date().toISOString(),
      });
    }
  }, [orderId]);

  const trackId = order?.id ?? orderId;

  return (
    <PageShell className="pb-20 md:pb-0">
      <div className="mx-auto max-w-lg px-4 py-16">
        <Card className="text-center animate-success-pop">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-eat-blue text-white">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-eat-red">
            Payment confirmed
          </p>
          <h1 className="mt-2 text-2xl font-bold text-eat-ink">Thanks for supporting local!</h1>
          <p className="mt-3 text-eat-muted">
            Your payment was processed by Eat76. The restaurant and a local driver will be notified.
          </p>
          {trackId && (
            <p className="mt-4 text-sm font-semibold text-eat-blue">
              Order {trackId}
            </p>
          )}
          {sessionId && (
            <p className="mt-2 text-xs text-eat-muted break-all">
              Payment ref: {sessionId}
            </p>
          )}
          <div className="mt-8 flex flex-col gap-3">
            {trackId && (
              <Button href={`/order/track/${trackId}`}>Track order</Button>
            )}
            <Button href="/order" variant="outline">
              Order again
            </Button>
            <Link href="/" className="text-sm font-semibold text-eat-blue hover:underline">
              Back to home
            </Link>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
