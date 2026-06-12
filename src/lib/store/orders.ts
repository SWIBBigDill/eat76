import { MOCK_DRIVER } from "@/lib/driver-location";
import type { OrderTrackStatus } from "@/lib/order-tracking";
import { readJsonFile, writeJsonFile } from "./file-store";

export type DriverLocation = { lat: number; lng: number };

export type StoredOrder = {
  id: string;
  sessionId?: string;
  restaurantId: string;
  restaurantName: string;
  items: { menuItemId: string; name: string; price: number; quantity: number }[];
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  tip: number;
  total: number;
  savings?: number;
  status: OrderTrackStatus;
  placedAt: string;
  source: "demo" | "stripe";
  deliveryAddress?: string;
  driver?: {
    id: string;
    name: string;
    vehicle: string;
    initials: string;
  };
  driverLocation?: DriverLocation;
  minutesAway?: number;
};

const ORDERS_FILE = "orders.json";

const DEFAULT_DELIVERY = "123 E State St, Kennett Square, PA 19348";

export async function getOrders(): Promise<StoredOrder[]> {
  return readJsonFile<StoredOrder[]>(ORDERS_FILE, []);
}

export async function getOrderById(id: string): Promise<StoredOrder | null> {
  const orders = await getOrders();
  return orders.find((o) => o.id === id) ?? null;
}

function withDriverDefaults(order: StoredOrder): StoredOrder {
  return {
    ...order,
    deliveryAddress: order.deliveryAddress ?? DEFAULT_DELIVERY,
    driver: order.driver ?? {
      id: MOCK_DRIVER.id,
      name: MOCK_DRIVER.name,
      vehicle: MOCK_DRIVER.vehicle,
      initials: MOCK_DRIVER.initials,
    },
    driverLocation: order.driverLocation ?? { lat: 39.8478, lng: -75.7075 },
    minutesAway: order.minutesAway ?? 5,
  };
}

export async function saveOrder(order: StoredOrder): Promise<StoredOrder> {
  const orders = await getOrders();
  const enriched = withDriverDefaults(order);
  const existing = orders.findIndex((o) => o.id === order.id);
  if (existing >= 0) {
    orders[existing] = { ...orders[existing], ...enriched };
  } else {
    orders.unshift(enriched);
  }
  await writeJsonFile(ORDERS_FILE, orders.slice(0, 500));
  return enriched;
}

export async function updateOrder(
  id: string,
  patch: Partial<StoredOrder>
): Promise<StoredOrder | null> {
  const orders = await getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx < 0) return null;
  orders[idx] = withDriverDefaults({ ...orders[idx], ...patch });
  await writeJsonFile(ORDERS_FILE, orders);
  return orders[idx];
}

export async function updateOrderStatus(
  id: string,
  status: OrderTrackStatus
): Promise<StoredOrder | null> {
  return updateOrder(id, { status });
}

export function orderFromStripeSession(params: {
  sessionId: string;
  metadata: Record<string, string | undefined>;
  amountTotal: number | null;
}): StoredOrder {
  const id =
    params.metadata.order_id ??
    `E76-${params.sessionId.slice(-8).toUpperCase()}`;

  return withDriverDefaults({
    id,
    sessionId: params.sessionId,
    restaurantId: params.metadata.restaurant_id ?? "unknown",
    restaurantName: params.metadata.restaurant_name ?? "Restaurant",
    items: [],
    subtotal: Number(params.metadata.food_subtotal ?? 0),
    serviceFee: 1.76,
    deliveryFee: 4.76,
    tip: Number(params.metadata.tip ?? 0),
    total: (params.amountTotal ?? 0) / 100,
    status: "placed",
    placedAt: new Date().toISOString(),
    source: "stripe",
  });
}
