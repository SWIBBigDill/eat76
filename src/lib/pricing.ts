export const RESTAURANT_TIER1_RATE = 0.1776;
export const RESTAURANT_TIER2_RATE = 0.12;
export const RESTAURANT_TIER1_LIMIT = 150;
export const SERVICE_FEE = 1.76;
export const DELIVERY_FEE = 4.76;
export const DRIVER_BASE_PAY = 6.76;
export const DEFAULT_COMPETITOR_RATE = 0.25;

export function calculateRestaurantPlatformFee(
  monthlyOrders: number,
  averageOrderValue: number
): number {
  const foodSales = monthlyOrders * averageOrderValue;
  if (monthlyOrders <= RESTAURANT_TIER1_LIMIT) {
    return foodSales * RESTAURANT_TIER1_RATE;
  }
  const tier1Sales = RESTAURANT_TIER1_LIMIT * averageOrderValue;
  const tier2Orders = monthlyOrders - RESTAURANT_TIER1_LIMIT;
  const tier2Sales = tier2Orders * averageOrderValue;
  return tier1Sales * RESTAURANT_TIER1_RATE + tier2Sales * RESTAURANT_TIER2_RATE;
}

export function calculateRestaurantSavings(params: {
  averageOrderValue: number;
  monthlyOrders: number;
  competitorRate: number;
}) {
  const { averageOrderValue, monthlyOrders, competitorRate } = params;
  const foodSales = monthlyOrders * averageOrderValue;
  const competitorFees = foodSales * (competitorRate / 100);
  const eat76Fees = calculateRestaurantPlatformFee(
    monthlyOrders,
    averageOrderValue
  );
  return {
    foodSales,
    competitorFees,
    eat76Fees,
    monthlySavings: competitorFees - eat76Fees,
    currentTier:
      monthlyOrders <= RESTAURANT_TIER1_LIMIT ? "tier1" : ("tier2" as const),
    tier1Rate: RESTAURANT_TIER1_RATE * 100,
    tier2Rate: RESTAURANT_TIER2_RATE * 100,
  };
}

export function getDaysInMonth(month: number, year = new Date().getFullYear()) {
  return new Date(year, month, 0).getDate();
}

export function calculateAdminProjections(params: {
  activeRestaurants: number;
  ordersPerRestaurantPerDay: number;
  averageOrderValue: number;
  monthNumber: number;
}) {
  const { activeRestaurants, ordersPerRestaurantPerDay, averageOrderValue, monthNumber } =
    params;
  const daysInMonth = getDaysInMonth(monthNumber);
  const ordersPerRestaurantMonth = ordersPerRestaurantPerDay * daysInMonth;
  const monthlyOrders = activeRestaurants * ordersPerRestaurantMonth;
  const monthlyFoodGmv = monthlyOrders * averageOrderValue;

  const feePerRestaurant = calculateRestaurantPlatformFee(
    ordersPerRestaurantMonth,
    averageOrderValue
  );
  const restaurantPlatformRevenue = feePerRestaurant * activeRestaurants;
  const customerFeeRevenue = monthlyOrders * SERVICE_FEE;
  const deliveryFeeRevenue = monthlyOrders * DELIVERY_FEE;
  const grossPlatformRevenue =
    restaurantPlatformRevenue + customerFeeRevenue + deliveryFeeRevenue;
  const driverPayouts = monthlyOrders * DRIVER_BASE_PAY;
  const estimatedContribution = grossPlatformRevenue - driverPayouts;

  return {
    daysInMonth,
    ordersPerRestaurantMonth,
    monthlyOrders,
    monthlyFoodGmv,
    restaurantPlatformRevenue,
    customerFeeRevenue,
    deliveryFeeRevenue,
    grossPlatformRevenue,
    driverPayouts,
    estimatedContribution,
  };
}

export function getRestaurantPricingTier(monthlyOrderCount: number) {
  if (monthlyOrderCount <= RESTAURANT_TIER1_LIMIT) {
    return {
      tier: 1 as const,
      rate: RESTAURANT_TIER1_RATE,
      label: "17.76% (orders 1–150)",
      ordersUntilTier2: RESTAURANT_TIER1_LIMIT - monthlyOrderCount,
    };
  }
  return {
    tier: 2 as const,
    rate: RESTAURANT_TIER2_RATE,
    label: "12% (orders 151+)",
    ordersUntilTier2: 0,
  };
}
