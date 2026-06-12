import type { OrderTrackStatus } from "@/lib/order-tracking";
import { TRACK_STEPS } from "@/lib/order-tracking";

const NOTIFICATIONS_KEY = "eat76-notifications";

export type AppNotification = {
  id: string;
  orderId?: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: "order" | "promo" | "system";
};

export function loadNotifications(): AppNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    return raw ? (JSON.parse(raw) as AppNotification[]) : [];
  } catch {
    return [];
  }
}

export function saveNotifications(notifications: AppNotification[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications.slice(0, 50)));
  } catch {
    /* ignore */
  }
}

export function addNotification(
  notification: Omit<AppNotification, "id" | "read">
): AppNotification {
  const entry: AppNotification = {
    ...notification,
    id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    read: false,
  };
  const current = loadNotifications();
  saveNotifications([entry, ...current]);
  return entry;
}

export function markNotificationRead(id: string) {
  const current = loadNotifications();
  saveNotifications(
    current.map((n) => (n.id === id ? { ...n, read: true } : n))
  );
}

export function markAllNotificationsRead() {
  saveNotifications(loadNotifications().map((n) => ({ ...n, read: true })));
}

export function unreadNotificationCount(): number {
  return loadNotifications().filter((n) => !n.read).length;
}

export function recordOrderStatusNotification(
  orderId: string,
  status: OrderTrackStatus,
  restaurantName: string
) {
  const step = TRACK_STEPS.find((s) => s.status === status);
  if (!step) return;

  const existing = loadNotifications();
  const duplicate = existing.some(
    (n) => n.orderId === orderId && n.message === step.notifyMessage
  );
  if (duplicate) return;

  addNotification({
    orderId,
    title: `${restaurantName} order update`,
    message: step.notifyMessage,
    createdAt: new Date().toISOString(),
    type: "order",
  });
}
