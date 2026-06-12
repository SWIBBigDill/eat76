import type { PlacedOrder } from "@/context/CartContext";

export type TrackStatus = "placed" | "preparing" | "out_for_delivery" | "delivered";

export const TRACK_STEPS: { status: TrackStatus; label: string; description: string }[] = [
  { status: "placed", label: "Order placed", description: "Restaurant received your order" },
  { status: "preparing", label: "Preparing", description: "Your food is being made" },
  { status: "out_for_delivery", label: "Out for delivery", description: "A local driver is on the way" },
  { status: "delivered", label: "Delivered", description: "Enjoy your meal!" },
];

const LAST_ORDER_KEY = "eat76-last-order";
const ORDER_HISTORY_KEY = "eat76-order-history";

/** Demo status advances by elapsed time since placedAt */
export function getDemoTrackStatus(placedAt: string): TrackStatus {
  const elapsed = Date.now() - new Date(placedAt).getTime();
  const minutes = elapsed / 60000;
  if (minutes < 2) return "placed";
  if (minutes < 5) return "preparing";
  if (minutes < 10) return "out_for_delivery";
  return "delivered";
}

export function statusIndex(status: TrackStatus): number {
  return TRACK_STEPS.findIndex((s) => s.status === status);
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
  } catch {
    /* ignore */
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
