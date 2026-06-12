import type { PlacedOrder } from "@/context/CartContext";
import { driverPositionAlongRoute, MOCK_DRIVER, routeProgressForStatus } from "@/lib/driver-location";

export type OrderTrackStatus =
  | "placed"
  | "restaurant_confirmed"
  | "preparing"
  | "ready"
  | "driver_picked_up"
  | "on_the_way"
  | "delivered";

export const TRACK_STEPS: {
  status: OrderTrackStatus;
  label: string;
  description: string;
  notifyMessage: string;
}[] = [
  {
    status: "placed",
    label: "Order placed",
    description: "We sent your order to the restaurant",
    notifyMessage: "Your order was placed successfully.",
  },
  {
    status: "restaurant_confirmed",
    label: "Restaurant confirmed",
    description: "They are getting started on your food",
    notifyMessage: "The restaurant confirmed your order.",
  },
  {
    status: "preparing",
    label: "Preparing",
    description: "Your food is being made fresh",
    notifyMessage: "Your order is being prepared.",
  },
  {
    status: "ready",
    label: "Ready",
    description: "Waiting for your driver to pick up",
    notifyMessage: "Your order is ready for pickup.",
  },
  {
    status: "driver_picked_up",
    label: "Driver picked up",
    description: "Your driver has your food",
    notifyMessage: "Your driver picked up your order.",
  },
  {
    status: "on_the_way",
    label: "On the way",
    description: "Heading to your door now",
    notifyMessage: "Your driver is on the way.",
  },
  {
    status: "delivered",
    label: "Delivered",
    description: "Enjoy your meal!",
    notifyMessage: "Your order was delivered. Enjoy!",
  },
];

const LAST_ORDER_KEY = "eat76-last-order";
const ORDER_HISTORY_KEY = "eat76-order-history";
const ORDER_STATUS_KEY = "eat76-order-status";

/** Demo status advances by elapsed time since placedAt */
export function getDemoTrackStatus(placedAt: string): OrderTrackStatus {
  const elapsed = Date.now() - new Date(placedAt).getTime();
  const minutes = elapsed / 60000;
  if (minutes < 0.5) return "placed";
  if (minutes < 1.5) return "restaurant_confirmed";
  if (minutes < 3) return "preparing";
  if (minutes < 4.5) return "ready";
  if (minutes < 6) return "driver_picked_up";
  if (minutes < 9) return "on_the_way";
  return "delivered";
}

/** Realistic ETA minutes remaining based on current status */
export function getEtaMinutes(status: OrderTrackStatus, placedAt: string): number {
  const baseByStatus: Record<OrderTrackStatus, number> = {
    placed: 38,
    restaurant_confirmed: 34,
    preparing: 28,
    ready: 20,
    driver_picked_up: 14,
    on_the_way: 6,
    delivered: 0,
  };
  const elapsed = (Date.now() - new Date(placedAt).getTime()) / 60000;
  const decay = Math.floor(elapsed * 0.8);
  return Math.max(0, baseByStatus[status] - decay);
}

export function formatEta(minutes: number): string {
  if (minutes <= 0) return "Arriving now";
  if (minutes === 1) return "About 1 min";
  if (minutes < 60) return `About ${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `About ${hrs} hr ${mins} min` : `About ${hrs} hr`;
}

export function statusIndex(status: OrderTrackStatus): number {
  return TRACK_STEPS.findIndex((s) => s.status === status);
}

export function progressPercent(status: OrderTrackStatus): number {
  const idx = statusIndex(status);
  if (idx < 0) return 0;
  return Math.round(((idx + 1) / TRACK_STEPS.length) * 100);
}

export function generateOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `E76-${ts}-${rand}`;
}

export function persistLastOrder(order: PlacedOrder) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
    const history = loadOrderHistory();
    const filtered = history.filter((o) => o.id !== order.id);
    filtered.unshift(order);
    localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(filtered.slice(0, 20)));
    saveLocalOrderStatus(order.id, "placed");
  } catch {
    /* ignore */
  }
}

export function saveLocalOrderStatus(orderId: string, status: OrderTrackStatus) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(ORDER_STATUS_KEY);
    const map: Record<string, OrderTrackStatus> = raw ? JSON.parse(raw) : {};
    map[orderId] = status;
    localStorage.setItem(ORDER_STATUS_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function loadLocalOrderStatus(orderId: string): OrderTrackStatus | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ORDER_STATUS_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw) as Record<string, OrderTrackStatus>;
    return map[orderId] ?? null;
  } catch {
    return null;
  }
}

export function loadLastOrder(): PlacedOrder | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LAST_ORDER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PlacedOrder;
  } catch {
    return null;
  }
}

export function loadOrderById(id: string): PlacedOrder | null {
  const history = loadOrderHistory();
  return history.find((o) => o.id === id) ?? (loadLastOrder()?.id === id ? loadLastOrder() : null);
}

export function loadOrderHistory(): PlacedOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDER_HISTORY_KEY);
    return raw ? (JSON.parse(raw) as PlacedOrder[]) : [];
  } catch {
    return [];
  }
}

export type TrackedOrder = PlacedOrder & {
  status: OrderTrackStatus;
  driver: typeof MOCK_DRIVER;
  driverLocation: { lat: number; lng: number };
  deliveryAddress: string;
  minutesAway: number;
};

export function enrichOrderForTracking(
  order: PlacedOrder,
  status?: OrderTrackStatus
): TrackedOrder {
  const resolved =
    status ??
    loadLocalOrderStatus(order.id) ??
    getDemoTrackStatus(order.placedAt);
  const routeProgress = routeProgressForStatus(resolved);
  const driverLocation = driverPositionAlongRoute(routeProgress);
  const minutesAway =
    resolved === "on_the_way"
      ? Math.max(2, getEtaMinutes(resolved, order.placedAt))
      : resolved === "driver_picked_up"
        ? Math.max(5, getEtaMinutes(resolved, order.placedAt))
        : 0;

  return {
    ...order,
    status: resolved,
    driver: MOCK_DRIVER,
    driverLocation,
    deliveryAddress: "123 E State St, Kennett Square, PA 19348",
    minutesAway,
  };
}

/** Map legacy store statuses to full track status */
export function normalizeStatus(status: string): OrderTrackStatus {
  const map: Record<string, OrderTrackStatus> = {
    placed: "placed",
    preparing: "preparing",
    out_for_delivery: "on_the_way",
    delivered: "delivered",
    incoming: "placed",
    accepted: "restaurant_confirmed",
    ready: "ready",
    completed: "delivered",
    driver_picked_up: "driver_picked_up",
    on_the_way: "on_the_way",
    restaurant_confirmed: "restaurant_confirmed",
  };
  return map[status] ?? "placed";
}

export function restaurantStatusToTrack(status: string): OrderTrackStatus {
  const map: Record<string, OrderTrackStatus> = {
    incoming: "placed",
    accepted: "restaurant_confirmed",
    preparing: "preparing",
    ready: "ready",
    completed: "delivered",
  };
  return map[status] ?? normalizeStatus(status);
}

export function driverStatusToTrack(status: string): OrderTrackStatus {
  const map: Record<string, OrderTrackStatus> = {
    available: "ready",
    claimed: "driver_picked_up",
    picked_up: "on_the_way",
    delivered: "delivered",
  };
  return map[status] ?? normalizeStatus(status);
}

export function getShareUrl(orderId: string): string {
  if (typeof window === "undefined") return `/order/track/${orderId}`;
  return `${window.location.origin}/order/track/${orderId}`;
}
