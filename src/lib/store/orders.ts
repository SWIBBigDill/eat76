import { MOCK_DRIVER } from "@/lib/driver-location";
import type { OrderTrackStatus } from "@/lib/order-tracking";
import { getSupabaseServer, hasSupabaseAdminKey } from "@/lib/supabase/server";
import type { SelectedOption } from "@/lib/types";
import { readJsonFile, writeJsonFile } from "./file-store";

export type DriverLocation = { lat: number; lng: number };

export type StoredOrderItem = {
  lineId: string;
  menuItemId: string;
  name: string;
  price: number;
  basePrice?: number;
  quantity: number;
  selectedOptions?: SelectedOption[];
  optionSummary?: string;
};

export type StoredOrder = {
  id: string;
  sessionId?: string;
  restaurantId: string;
  restaurantName: string;
  customerName?: string;
  customerEmail?: string;
  items: StoredOrderItem[];
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
  notes?: string;
  promoCode?: string;
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

function initialsFor(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
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

/* ---------- Supabase row mapping ---------- */

type OrderRow = {
  id: string;
  stripe_session_id: string | null;
  restaurant_id: string | null;
  restaurant_name: string;
  customer_name: string | null;
  customer_email: string | null;
  delivery_address: string | null;
  items: StoredOrderItem[];
  subtotal: number | string;
  service_fee: number | string;
  delivery_fee: number | string;
  tip: number | string;
  total: number | string;
  savings: number | string | null;
  status: string;
  source: "demo" | "stripe";
  driver_name: string | null;
  driver_vehicle: string | null;
  minutes_away: number | null;
  notes: string | null;
  promo_code: string | null;
  placed_at: string;
};

function rowToOrder(row: OrderRow): StoredOrder {
  return withDriverDefaults({
    id: row.id,
    sessionId: row.stripe_session_id ?? undefined,
    restaurantId: row.restaurant_id ?? "unknown",
    restaurantName: row.restaurant_name,
    customerName: row.customer_name ?? undefined,
    customerEmail: row.customer_email ?? undefined,
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal),
    serviceFee: Number(row.service_fee),
    deliveryFee: Number(row.delivery_fee),
    tip: Number(row.tip),
    total: Number(row.total),
    savings: row.savings != null ? Number(row.savings) : undefined,
    status: row.status as OrderTrackStatus,
    placedAt: row.placed_at,
    source: row.source,
    deliveryAddress: row.delivery_address ?? undefined,
    notes: row.notes ?? undefined,
    promoCode: row.promo_code ?? undefined,
    driver:
      row.driver_name != null
        ? {
            id: "driver-1",
            name: row.driver_name,
            vehicle: row.driver_vehicle ?? "Car",
            initials: initialsFor(row.driver_name),
          }
        : undefined,
    minutesAway: row.minutes_away ?? undefined,
  });
}

function orderToRow(order: StoredOrder) {
  return {
    id: order.id,
    stripe_session_id: order.sessionId ?? null,
    restaurant_id: order.restaurantId,
    restaurant_name: order.restaurantName,
    customer_name: order.customerName ?? null,
    customer_email: order.customerEmail ?? null,
    delivery_address: order.deliveryAddress ?? null,
    items: order.items,
    subtotal: order.subtotal,
    service_fee: order.serviceFee,
    delivery_fee: order.deliveryFee,
    tip: order.tip,
    total: order.total,
    savings: order.savings ?? null,
    status: order.status,
    source: order.source,
    driver_name: order.driver?.name ?? null,
    driver_vehicle: order.driver?.vehicle ?? null,
    minutes_away: order.minutesAway ?? null,
    notes: order.notes ?? null,
    promo_code: order.promoCode ?? null,
    placed_at: order.placedAt,
  };
}

/* ---------- File store fallback ---------- */

async function fileGetOrders(): Promise<StoredOrder[]> {
  return readJsonFile<StoredOrder[]>(ORDERS_FILE, []);
}

async function fileSaveOrder(order: StoredOrder): Promise<StoredOrder> {
  const orders = await fileGetOrders();
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

async function fileUpdateOrder(
  id: string,
  patch: Partial<StoredOrder>
): Promise<StoredOrder | null> {
  const orders = await fileGetOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx < 0) return null;
  orders[idx] = withDriverDefaults({ ...orders[idx], ...patch });
  await writeJsonFile(ORDERS_FILE, orders);
  return orders[idx];
}

/* ---------- Public API: Supabase first, file fallback ---------- */

export async function getOrders(): Promise<StoredOrder[]> {
  const supabase = getSupabaseServer();
  if (supabase) {
    const { data, error } = await supabase.rpc("get_recent_orders");
    if (!error && Array.isArray(data)) {
      return (data as OrderRow[]).map(rowToOrder);
    }
    console.error("[orders] get_recent_orders failed:", error?.message);
  }
  return fileGetOrders();
}

export async function getOrderById(id: string): Promise<StoredOrder | null> {
  const supabase = getSupabaseServer();
  if (supabase) {
    const { data, error } = await supabase.rpc("get_order_by_id", {
      p_order_id: id,
    });
    if (!error && Array.isArray(data) && data.length > 0) {
      return rowToOrder(data[0] as OrderRow);
    }
    if (error) console.error("[orders] get_order_by_id failed:", error.message);
    if (!error) return null;
  }
  const orders = await fileGetOrders();
  return orders.find((o) => o.id === id) ?? null;
}

export async function getOrdersForRestaurant(
  restaurantId: string
): Promise<StoredOrder[]> {
  const supabase = getSupabaseServer();
  if (supabase) {
    const { data, error } = await supabase.rpc("get_restaurant_orders", {
      p_restaurant_id: restaurantId,
    });
    if (!error && Array.isArray(data)) {
      return (data as OrderRow[]).map(rowToOrder);
    }
    console.error("[orders] get_restaurant_orders failed:", error?.message);
  }
  const orders = await fileGetOrders();
  return orders.filter((o) => o.restaurantId === restaurantId);
}

export async function getActiveDeliveries(): Promise<StoredOrder[]> {
  const supabase = getSupabaseServer();
  if (supabase) {
    const { data, error } = await supabase.rpc("get_active_deliveries");
    if (!error && Array.isArray(data)) {
      return (data as OrderRow[]).map(rowToOrder);
    }
    console.error("[orders] get_active_deliveries failed:", error?.message);
  }
  const orders = await fileGetOrders();
  return orders.filter((o) =>
    ["restaurant_confirmed", "preparing", "ready", "driver_picked_up", "on_the_way"].includes(
      o.status
    )
  );
}

export async function saveOrder(order: StoredOrder): Promise<StoredOrder> {
  const enriched = withDriverDefaults(order);
  const supabase = getSupabaseServer();
  if (supabase) {
    const row = orderToRow(enriched);
    const result = hasSupabaseAdminKey()
      ? await supabase.from("orders").upsert(row)
      : await supabase.from("orders").insert(row);
    if (!result.error) return enriched;
    // Duplicate id on the anon path means the order already exists; treat as saved.
    if (result.error.code === "23505") return enriched;
    console.error("[orders] save failed:", result.error.message);
  }
  return fileSaveOrder(enriched);
}

export async function updateOrder(
  id: string,
  patch: Partial<StoredOrder>
): Promise<StoredOrder | null> {
  const supabase = getSupabaseServer();
  if (supabase) {
    let latest: StoredOrder | null = null;

    if (patch.status) {
      const { data, error } = await supabase.rpc("update_order_status", {
        p_order_id: id,
        p_status: patch.status,
      });
      if (error) {
        console.error("[orders] update_order_status failed:", error.message);
      } else if (Array.isArray(data) && data.length > 0) {
        latest = rowToOrder(data[0] as OrderRow);
      }
    }

    if (patch.driver) {
      const { data, error } = await supabase.rpc("assign_driver", {
        p_order_id: id,
        p_driver_name: patch.driver.name,
        p_driver_vehicle: patch.driver.vehicle,
      });
      if (error) {
        console.error("[orders] assign_driver failed:", error.message);
      } else if (Array.isArray(data) && data.length > 0) {
        latest = rowToOrder(data[0] as OrderRow);
      }
    }

    if (latest) {
      return { ...latest, ...stripUndefined(patch), status: latest.status };
    }
    // No persistable fields changed (e.g. only driverLocation); read current.
    const current = await getOrderById(id);
    if (current) return { ...current, ...stripUndefined(patch) };
  }
  return fileUpdateOrder(id, patch);
}

function stripUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
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
