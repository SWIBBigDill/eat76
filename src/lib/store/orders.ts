import { readJsonFile, writeJsonFile } from "./file-store";

// Swap to Supabase: await supabase.from('orders').insert(order)

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
  status: "placed" | "preparing" | "out_for_delivery" | "delivered";
  placedAt: string;
  source: "demo" | "stripe";
};

const ORDERS_FILE = "orders.json";

export async function getOrders(): Promise<StoredOrder[]> {
  return readJsonFile<StoredOrder[]>(ORDERS_FILE, []);
}

export async function getOrderById(id: string): Promise<StoredOrder | null> {
  const orders = await getOrders();
  return orders.find((o) => o.id === id) ?? null;
}

export async function saveOrder(order: StoredOrder): Promise<StoredOrder> {
  const orders = await getOrders();
  const existing = orders.findIndex((o) => o.id === order.id);
  if (existing >= 0) {
    orders[existing] = order;
  } else {
    orders.unshift(order);
  }
  await writeJsonFile(ORDERS_FILE, orders.slice(0, 500));
  return order;
}

export async function updateOrderStatus(
  id: string,
  status: StoredOrder["status"]
): Promise<StoredOrder | null> {
  const orders = await getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx < 0) return null;
  orders[idx] = { ...orders[idx], status };
  await writeJsonFile(ORDERS_FILE, orders);
  return orders[idx];
}

export function orderFromStripeSession(params: {
  sessionId: string;
  metadata: Record<string, string | undefined>;
  amountTotal: number | null;
}): StoredOrder {
  const id =
    params.metadata.order_id ??
    `E76-${params.sessionId.slice(-8).toUpperCase()}`;

  return {
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
  };
}
