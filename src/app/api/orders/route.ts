import { NextResponse } from "next/server";
import { getOrders, saveOrder, type StoredOrder } from "@/lib/store/orders";

export const runtime = "nodejs";

export async function GET() {
  try {
    const orders = await getOrders();
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
    // Swap to Supabase: await supabase.from('orders').insert(body)
    const saved = await saveOrder(body);
    return NextResponse.json({ ok: true, order: saved });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save order.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
