"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DriverMap } from "@/components/order/DriverMap";
import { OrderTracker } from "@/components/order/OrderTracker";
import { OrderUpdateToast } from "@/components/order/OrderUpdateToast";
import { RateOrder } from "@/components/order/RateOrder";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { PlacedOrder } from "@/context/CartContext";
import { useOrderTracking } from "@/hooks/useOrderTracking";
import { formatEta, getShareUrl, loadOrderById } from "@/lib/order-tracking";

function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
}

export default function TrackOrderPage() {
  const params = useParams();
  const orderId = params.id as string;
  const baseOrder = useMemo(() => loadOrderById(orderId), [orderId]);
  const { order, etaMinutes, notification, dismissNotification } = useOrderTracking(
    baseOrder as PlacedOrder | null
  );
  const [showNotifyPrompt, setShowNotifyPrompt] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [notifyDismissed, setNotifyDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission === "default" && !notifyDismissed) {
      setShowNotifyPrompt(true);
    }
  }, [notifyDismissed]);

  const handleEnableNotifications = useCallback(async () => {
    if (!("Notification" in window)) return;
    try {
      await Notification.requestPermission();
    } catch {
      /* graceful decline */
    }
    setShowNotifyPrompt(false);
    setNotifyDismissed(true);
  }, []);

  const handleDismissNotify = useCallback(() => {
    setShowNotifyPrompt(false);
    setNotifyDismissed(true);
    dismissNotification();
  }, [dismissNotification]);

  const copyShareLink = useCallback(async () => {
    const url = getShareUrl(orderId);
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [orderId]);

  if (!baseOrder || !order) {
    return (
      <PageShell className="pb-20 md:pb-0">
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-eat-ink">Order not found</h1>
          <p className="mt-2 text-eat-muted">
            We couldn&apos;t find order <strong>{orderId}</strong> on this device. Place a new order to track it here.
          </p>
          <Button href="/order" className="mt-6">
            Browse restaurants
          </Button>
        </div>
      </PageShell>
    );
  }

  const isDelivered = order.status === "delivered";
  const showMap =
    order.status === "driver_picked_up" ||
    order.status === "on_the_way" ||
    order.status === "delivered";

  return (
    <PageShell className="pb-24 md:pb-0">
      <OrderUpdateToast
        message={notification}
        onDismiss={handleDismissNotify}
        onEnableNotifications={handleEnableNotifications}
        showNotifyPrompt={showNotifyPrompt}
      />

      <div className="sticky top-0 z-40 border-b border-eat-border bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-eat-ink">{order.restaurantName}</p>
            <p className="text-xs text-eat-muted">Order {order.id}</p>
          </div>
          <div className="shrink-0 text-right">
            {isDelivered ? (
              <p className="text-sm font-bold text-eat-blue">Delivered</p>
            ) : (
              <>
                <p className="text-lg font-bold text-eat-red">{formatEta(etaMinutes)}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-eat-muted">ETA</p>
              </>
            )}
          </div>
        </div>
      </div>

      <section className="eat-section pt-4">
        <div className="mx-auto max-w-lg px-4">
          <div className="flex items-center justify-between gap-2">
            <Link href="/order/confirmation" className="text-sm font-semibold text-eat-blue">
              ← Confirmation
            </Link>
            <button
              type="button"
              onClick={() => void copyShareLink()}
              className="text-sm font-semibold text-eat-blue tap-target"
            >
              {shareCopied ? "Link copied!" : "Share tracking link"}
            </button>
          </div>

          <h1 className="mt-4 text-2xl font-bold text-eat-ink">Track your order</h1>
          <p className="mt-1 text-sm text-eat-muted">
            Live updates refresh every 30 seconds.
          </p>

          {showMap && (
            <div className="mt-6">
              <DriverMap
                status={order.status}
                driverName={order.driver.name}
                driverInitials={order.driver.initials}
                vehicle={order.driver.vehicle}
                minutesAway={order.minutesAway}
                collapsible
              />
            </div>
          )}

          <Card className="mt-6">
            <OrderTracker status={order.status} />
          </Card>

          <Card className="mt-6">
            <p className="text-sm font-semibold text-eat-ink">Order summary</p>
            <p className="text-xs text-eat-muted">{order.restaurantName}</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {order.items.map((item) => (
                <li key={item.lineId ?? item.menuItemId} className="flex justify-between gap-2">
                  <span>
                    {item.quantity}× {item.name}
                  </span>
                  <span>{formatMoney(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 border-t border-eat-border pt-3 text-sm">
              <div className="flex justify-between text-eat-muted">
                <span>Food subtotal</span>
                <span>{formatMoney(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-eat-muted">
                <span>Service + delivery</span>
                <span>{formatMoney(order.serviceFee + order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-eat-muted">
                <span>Tip</span>
                <span>{formatMoney(order.tip)}</span>
              </div>
              <div className="flex justify-between pt-2 font-bold text-eat-ink">
                <span>Total paid</span>
                <span className="text-eat-blue">{formatMoney(order.total)}</span>
              </div>
            </div>
            {order.savings > 0 && (
              <p className="mt-3 rounded-xl bg-eat-red/5 px-3 py-2 text-sm font-semibold text-eat-red">
                You saved {formatMoney(order.savings)} vs typical big-app fees on this order.
              </p>
            )}
          </Card>

          {isDelivered && (
            <div className="mt-6">
              <RateOrder
                restaurantName={order.restaurantName}
                restaurantId={order.restaurantId}
                driverName={order.driver.name}
              />
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3">
            <Button href={`/order/${order.restaurantId}`}>Order again</Button>
            <Button href="/order" variant="outline">
              Browse more restaurants
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
