import type { Driver, DriverDelivery } from "@/lib/types";
import { DRIVER_BASE_PAY } from "@/lib/pricing";

export const drivers: Driver[] = [
  {
    id: "drv-1",
    name: "Chris P.",
    zip: "19348",
    vehicleType: "Sedan",
    status: "active",
  },
  {
    id: "drv-2",
    name: "Sam K.",
    zip: "19348",
    vehicleType: "SUV",
    status: "active",
  },
  {
    id: "drv-3",
    name: "Jordan T.",
    zip: "19348",
    vehicleType: "Hybrid",
    status: "offline",
  },
];

export const initialDeliveries: DriverDelivery[] = [
  {
    id: "del-2001",
    orderId: "ord-1004",
    restaurantName: "Chestnut Café",
    customerAddress: "123 E State St, Kennett Square",
    distance: "1.8 mi",
    basePay: DRIVER_BASE_PAY,
    tip: 2.0,
    status: "available",
  },
  {
    id: "del-2002",
    orderId: "ord-1003",
    restaurantName: "State Street Tacos",
    customerAddress: "45 Birch St, Kennett Square",
    distance: "2.4 mi",
    basePay: DRIVER_BASE_PAY,
    tip: 3.0,
    status: "available",
  },
  {
    id: "del-2003",
    orderId: "ord-1002",
    restaurantName: "Kennett Square Grill",
    customerAddress: "8 Willow Ln, Kennett Square",
    distance: "1.1 mi",
    basePay: DRIVER_BASE_PAY,
    tip: 4.0,
    status: "claimed",
  },
];
