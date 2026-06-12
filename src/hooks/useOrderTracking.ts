"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PlacedOrder } from "@/context/CartContext";
import { driverPositionAlongRoute, MOCK_DRIVER, routeProgressForStatus } from "@/lib/driver-location";
import {
  enrichOrderForTracking,
  getDemoTrackStatus,
  getEtaMinutes,
  loadLocalOrderStatus,
  normalizeStatus,
  saveLocalOrderStatus,
  TRACK_STEPS,
  type OrderTrackStatus,
  type TrackedOrder,
} from "@/lib/order-tracking";
import { recordOrderStatusNotification } from "@/lib/notifications";

const POLL_INTERVAL_MS = 10_000;
const DEMO_TICK_MS = 5_000;

type ApiOrder = TrackedOrder & { etaMinutes?: number };

type UseOrderTrackingResult = {
  order: TrackedOrder | null;
  loading: boolean;
  etaMinutes: number;
  notification: string | null;
  dismissNotification: () => void;
  refresh: () => void;
};

function mergeApiOrder(base: PlacedOrder, api: Partial<ApiOrder>): TrackedOrder {
  const status = normalizeStatus(api.status ?? getDemoTrackStatus(base.placedAt));
  const routeProgress = routeProgressForStatus(status);
  return {
    ...base,
    status,
    driver: api.driver ?? MOCK_DRIVER,
    driverLocation: api.driverLocation ?? driverPositionAlongRoute(routeProgress),
    deliveryAddress: api.deliveryAddress ?? "123 E State St, Kennett Square, PA 19348",
    minutesAway: api.minutesAway ?? 0,
  };
}

export function useOrderTracking(order: PlacedOrder | null): UseOrderTrackingResult {
  const [tracked, setTracked] = useState<TrackedOrder | null>(() =>
    order ? enrichOrderForTracking(order) : null
  );
  const [loading, setLoading] = useState(true);
  const [etaMinutes, setEtaMinutes] = useState(0);
  const [notification, setNotification] = useState<string | null>(null);
  const prevStatusRef = useRef<OrderTrackStatus | null>(null);
  // True once the orders API answers for this order; from then on the server
  // is the source of truth and the local demo timer stops advancing status.
  const apiLiveRef = useRef(false);

  const notifyStatusChange = useCallback((status: OrderTrackStatus) => {
    const step = TRACK_STEPS.find((s) => s.status === status);
    if (step) {
      setNotification(step.notifyMessage);
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        new Notification("Eat76 order update", { body: step.notifyMessage });
      }
    }
  }, []);

  const applyStatus = useCallback(
    (status: OrderTrackStatus, base: PlacedOrder) => {
      const enriched = enrichOrderForTracking(base, status);
      setTracked(enriched);
      setEtaMinutes(getEtaMinutes(status, base.placedAt));
      saveLocalOrderStatus(base.id, status);

      if (prevStatusRef.current !== null && prevStatusRef.current !== status) {
        notifyStatusChange(status);
        recordOrderStatusNotification(base.id, status, base.restaurantName);
      }
      prevStatusRef.current = status;
    },
    [notifyStatusChange]
  );

  const fetchFromApi = useCallback(async () => {
    if (!order) return;
    try {
      const res = await fetch(`/api/orders/${order.id}`);
      if (res.ok) {
        const data = (await res.json()) as { order: ApiOrder };
        apiLiveRef.current = true;
        const merged = mergeApiOrder(order, data.order);
        applyStatus(merged.status, order);
        if (data.order.etaMinutes !== undefined) {
          setEtaMinutes(data.order.etaMinutes);
        }
        return;
      }
    } catch {
      /* fall through to local demo */
    }

    const local = loadLocalOrderStatus(order.id);
    const demo = local ?? getDemoTrackStatus(order.placedAt);
    applyStatus(demo, order);
  }, [order, applyStatus]);

  const refresh = useCallback(() => {
    void fetchFromApi();
  }, [fetchFromApi]);

  useEffect(() => {
    if (!order) {
      const frame = requestAnimationFrame(() => {
        setTracked(null);
        setLoading(false);
      });
      return () => cancelAnimationFrame(frame);
    }

    prevStatusRef.current = loadLocalOrderStatus(order.id) ?? getDemoTrackStatus(order.placedAt);
    const frame = requestAnimationFrame(() => setLoading(true));
    const initialFetch = window.setTimeout(() => {
      void fetchFromApi().finally(() => {
        requestAnimationFrame(() => setLoading(false));
      });
    }, 0);

    const poll = window.setInterval(() => {
      void fetchFromApi();
    }, POLL_INTERVAL_MS);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(initialFetch);
      window.clearInterval(poll);
    };
  }, [order, fetchFromApi]);

  useEffect(() => {
    if (!order || !tracked) return;

    const tick = () => {
      const current = tracked.status;

      if (apiLiveRef.current) {
        // Server-backed order: just keep ETA fresh between polls.
        setEtaMinutes(getEtaMinutes(current, order.placedAt));
        if (current === "on_the_way" && tracked.minutesAway > 2) {
          setTracked((prev) =>
            prev ? { ...prev, minutesAway: Math.max(2, prev.minutesAway - 1) } : prev
          );
        }
        return;
      }

      const apiStatus = loadLocalOrderStatus(order.id);
      const demoStatus = getDemoTrackStatus(order.placedAt);
      const next = apiStatus && statusRank(apiStatus) >= statusRank(demoStatus) ? apiStatus : demoStatus;

      if (statusRank(next) > statusRank(current)) {
        applyStatus(next, order);
      } else {
        setEtaMinutes(getEtaMinutes(current, order.placedAt));
        if (current === "on_the_way" && tracked.minutesAway > 2) {
          setTracked((prev) =>
            prev ? { ...prev, minutesAway: Math.max(2, prev.minutesAway - 1) } : prev
          );
        }
      }
    };

    const interval = window.setInterval(tick, DEMO_TICK_MS);
    return () => window.clearInterval(interval);
  }, [order, tracked, applyStatus]);

  const dismissNotification = useCallback(() => setNotification(null), []);

  return { order: tracked, loading, etaMinutes, notification, dismissNotification, refresh };
}

function statusRank(status: OrderTrackStatus): number {
  const order: OrderTrackStatus[] = [
    "placed",
    "restaurant_confirmed",
    "preparing",
    "ready",
    "driver_picked_up",
    "on_the_way",
    "delivered",
  ];
  return order.indexOf(status);
}
