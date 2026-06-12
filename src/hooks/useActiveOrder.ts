"use client";

import { useEffect, useState } from "react";
import type { PlacedOrder } from "@/context/CartContext";
import {
  getDemoTrackStatus,
  getEtaMinutes,
  loadLastOrder,
  type OrderTrackStatus,
} from "@/lib/order-tracking";

export type ActiveOrderInfo = {
  order: PlacedOrder;
  status: OrderTrackStatus;
  etaMinutes: number;
};

export function useActiveOrder(): ActiveOrderInfo | null {
  const [active, setActive] = useState<ActiveOrderInfo | null>(null);

  useEffect(() => {
    function refresh() {
      const order = loadLastOrder();
      if (!order) {
        setActive(null);
        return;
      }
      const status = getDemoTrackStatus(order.placedAt);
      if (status === "delivered") {
        setActive(null);
        return;
      }
      setActive({
        order,
        status,
        etaMinutes: getEtaMinutes(status, order.placedAt),
      });
    }

    refresh();
    const interval = window.setInterval(refresh, 5000);
    return () => window.clearInterval(interval);
  }, []);

  return active;
}
