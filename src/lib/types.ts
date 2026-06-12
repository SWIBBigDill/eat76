export type Restaurant = {
  id: string;
  name: string;
  foodType: string;
  distance: string;
  deliveryTime: string;
  rating: number;
  zip: string;
};

export type MenuItem = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
};

export type OrderStatus =
  | "incoming"
  | "accepted"
  | "preparing"
  | "ready"
  | "completed";

export type Order = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  status: OrderStatus;
  createdAt: string;
  tip: number;
};

export type DriverDeliveryStatus =
  | "available"
  | "claimed"
  | "picked_up"
  | "delivered";

export type DriverDelivery = {
  id: string;
  orderId: string;
  restaurantName: string;
  customerAddress: string;
  distance: string;
  basePay: number;
  tip: number;
  status: DriverDeliveryStatus;
};

export type Driver = {
  id: string;
  name: string;
  zip: string;
  vehicleType: string;
  status: "active" | "offline";
};

export type CartItem = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
};

export type EarlyAccessType = "restaurant" | "driver" | "customer";

export type RestaurantSubmission = {
  type: "restaurant";
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  estimatedMonthlyOrders: string;
  currentDeliveryApp: string;
  notes: string;
  submittedAt: string;
};

export type DriverSubmission = {
  type: "driver";
  name: string;
  email: string;
  phone: string;
  zipCode: string;
  availability: string;
  vehicleType: string;
  notes: string;
  submittedAt: string;
};

export type CustomerSubmission = {
  type: "customer";
  name: string;
  email: string;
  zipCode: string;
  submittedAt: string;
};

export type EarlyAccessSubmission =
  | RestaurantSubmission
  | DriverSubmission
  | CustomerSubmission;
