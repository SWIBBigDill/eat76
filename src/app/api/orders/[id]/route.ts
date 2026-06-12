import { NextResponse } from "next/server";
import {
  driverPositionAlongRoute,
  routeProgressForStatus,
} from "@/lib/driver-location";
import { getEtaMinutes, normalizeStatus, type OrderTrackStatus } from "@/lib/order-tracking";
import { getOrderById, updateOrder, type StoredOrder } from "@/lib/store/orders";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

function enrichForResponse(order: StoredOrder): StoredOrder & { etaMinutes: number } {
  const status = normalizeStatus(order.status);
  const routeProgress = routeProgressForStatus(status);
  const driverLocation = driverPositionAlongRoute(routeProgress);
  const etaMinutes = getEtaMinutes(status, order.placedAt);
  const minutesAway =
    status === "on_the_way" || status === "driver_picked_up"
      ? Math.max(2, etaMinutes)
      : 0;

  return {
    ...order,
    status,
    driverLocation,
    minutesAway,
    etaMinutes,
  };
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    return NextResponse.json({ order: enrichForResponse(order) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load order.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;

  let body: Partial<StoredOrder>;
  try {
    body = (await request.json()) as Partial<StoredOrder>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const patch: Partial<StoredOrder> = {};
  if (body.status) {
    patch.status = normalizeStatus(body.status) as OrderTrackStatus;
  }
  if (body.driverLocation) patch.driverLocation = body.driverLocation;
  if (body.minutesAway !== undefined) patch.minutesAway = body.minutesAway;
  if (body.driver) patch.driver = body.driver;

  try {
    const updated = await updateOrder(id, patch);
    if (!updated) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, order: enrichForResponse(updated) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update order.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
