import { NextResponse } from "next/server";
import { sendOrderConfirmationEmail } from "@/lib/notify/email";
import {
  getActiveDeliveries,
  getOrders,
  getOrdersForRestaurant,
  saveOrder,
  type StoredOrder,
} from "@/lib/store/orders";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get("restaurantId");
  const active = searchParams.get("active");

  try {
    let orders: StoredOrder[];
    if (restaurantId) {
      orders = await getOrdersForRestaurant(restaurantId);
    } else if (active) {
      orders = await getActiveDeliveries();
    } else {
      orders = await getOrders();
    }
    return NextResponse.json({ orders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load orders.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: StoredOrder;
  try {
    body = (await request.json()) as StoredOrder;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.id || !body.restaurantId) {
    return NextResponse.json({ error: "Invalid order." }, { status: 400 });
  }

  try {
    const saved = await saveOrder(body);
    void sendOrderConfirmationEmail(saved);
    return NextResponse.json({ ok: true, order: saved });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save order.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
