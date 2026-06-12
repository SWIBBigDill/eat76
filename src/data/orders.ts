import type { Order } from "@/lib/types";

export const initialOrders: Order[] = [
  {
    id: "ord-1001",
    restaurantId: "portabellos",
    restaurantName: "Portabellos",
    customerName: "Jamie R.",
    items: [
      { name: "Antipasti Classico", quantity: 1, price: 16.0 },
      { name: "House Salad", quantity: 1, price: 9.0 },
    ],
    subtotal: 25.0,
    status: "incoming",
    createdAt: new Date().toISOString(),
    tip: 5.0,
  },
  {
    id: "ord-1002",
    restaurantId: "lettys-tavern",
    restaurantName: "Letty's Tavern",
    customerName: "Alex M.",
    items: [
      { name: "House Burger", quantity: 2, price: 14.0 },
      { name: "French Fries", quantity: 1, price: 5.0 },
    ],
    subtotal: 33.0,
    status: "accepted",
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    tip: 4.0,
  },
  {
    id: "ord-1003",
    restaurantId: "michoacana-grill",
    restaurantName: "Michoacana Grill",
    customerName: "Taylor S.",
    items: [{ name: "Street Taco Trio", quantity: 2, price: 12.0 }],
    subtotal: 24.0,
    status: "preparing",
    createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
    tip: 3.0,
  },
  {
    id: "ord-1004",
    restaurantId: "caffe-pura",
    restaurantName: "Caffè Pura",
    customerName: "Morgan L.",
    items: [
      { name: "Avocado Toast", quantity: 1, price: 10.0 },
      { name: "House Latte", quantity: 2, price: 5.0 },
    ],
    subtotal: 20.0,
    status: "ready",
    createdAt: new Date(Date.now() - 50 * 60000).toISOString(),
    tip: 2.0,
  },
];
