import { initialOrders } from "@/data/orders";
import { restaurants } from "@/data/restaurants";
import {
  calculateAdminProjections,
  calculateRestaurantPlatformFee,
  DELIVERY_FEE,
  DRIVER_BASE_PAY,
  SERVICE_FEE,
} from "@/lib/pricing";

const DEMO_RESTAURANTS_ONBOARDED = 6;
const DEMO_DRIVERS_ACTIVE = 4;
const AVG_ORDER_VALUE = 34;

export function computeAdminStats() {
  const ordersToday = initialOrders.length + 24;
  const monthlyOrders = ordersToday * 22;
  const monthlyGmv = monthlyOrders * AVG_ORDER_VALUE;
  const avgOrderValue = AVG_ORDER_VALUE;

  const restaurantFees = calculateRestaurantPlatformFee(monthlyOrders, avgOrderValue);
  const customerFees = monthlyOrders * SERVICE_FEE;
  const deliveryFees = monthlyOrders * DELIVERY_FEE;
  const platformRevenue = restaurantFees + customerFees + deliveryFees;
  const driverPayouts = monthlyOrders * DRIVER_BASE_PAY;
  const estimatedContribution = platformRevenue - driverPayouts;

  const projections = calculateAdminProjections({
    activeRestaurants: DEMO_RESTAURANTS_ONBOARDED,
    ordersPerRestaurantPerDay: 8,
    averageOrderValue: AVG_ORDER_VALUE,
    monthNumber: new Date().getMonth() + 1,
  });

  return {
    activeRestaurants: DEMO_RESTAURANTS_ONBOARDED,
    activeDrivers: DEMO_DRIVERS_ACTIVE,
    totalRestaurantsListed: restaurants.length,
    ordersToday,
    monthlyGmv,
    platformRevenue: Math.round(platformRevenue),
    driverPayouts: Math.round(driverPayouts),
    estimatedContribution: Math.round(estimatedContribution),
    projections,
  };
}
