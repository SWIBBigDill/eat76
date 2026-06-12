import type { Order } from "@/lib/types";

export const initialOrders: Order[] = [
  {
    id: "ord-1001",
    restaurantId: "mushroom-bistro",
    restaurantName: "Mushroom Bistro",
    customerName: "Jamie R.",
    items: [
      { name: "Wild Mushroom Pasta", quantity: 1, price: 18.0 },
      { name: "Garden Salad", quantity: 1, price: 11.0 },
    ],
    subtotal: 29.0,
    status: "incoming",
    createdAt: new Date().toISOString(),
    tip: 5.0,
  },
  {
    id: "ord-1002",
    restaurantId: "kennett-square-grill",
    restaurantName: "Kennett Square Grill",
    customerName: "Alex M.",
    items: [
      { name: "Kennett Classic Burger", quantity: 2, price: 14.5 },
      { name: "Hand-Cut Fries", quantity: 1, price: 5.5 },
    ],
    subtotal: 34.5,
    status: "accepted",
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    tip: 4.0,
  },
  {
    id: "ord-1003",
    restaurantId: "state-street-tacos",
    restaurantName: "State Street Tacos",
    customerName: "Taylor S.",
    items: [{ name: "Street Taco Trio", quantity: 2, price: 12.0 }],
    subtotal: 24.0,
    status: "preparing",
    createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
    tip: 3.0,
  },
  {
    id: "ord-1004",
    restaurantId: "chestnut-cafe",
    restaurantName: "Chestnut Café",
    customerName: "Morgan L.",
    items: [
      { name: "Avocado Toast", quantity: 1, price: 10.5 },
      { name: "House Latte", quantity: 2, price: 5.25 },
    ],
    subtotal: 21.0,
    status: "ready",
    createdAt: new Date(Date.now() - 50 * 60000).toISOString(),
    tip: 2.0,
  },
];
