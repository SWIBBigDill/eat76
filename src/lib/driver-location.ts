/** Mock coordinates for Kennett Square / 19348 demo deliveries */

export type LatLng = { lat: number; lng: number };

export const KENNETT_CENTER: LatLng = { lat: 39.8468, lng: -75.7116 };

export const DEMO_RESTAURANT: LatLng = { lat: 39.8462, lng: -75.7098 };
export const DEMO_CUSTOMER: LatLng = { lat: 39.8495, lng: -75.7042 };

/** Interpolate driver position along route (0 = restaurant, 1 = customer) */
export function driverPositionAlongRoute(progress: number): LatLng {
  const t = Math.min(1, Math.max(0, progress));
  return {
    lat: DEMO_RESTAURANT.lat + (DEMO_CUSTOMER.lat - DEMO_RESTAURANT.lat) * t,
    lng: DEMO_RESTAURANT.lng + (DEMO_CUSTOMER.lng - DEMO_RESTAURANT.lng) * t,
  };
}

/** Progress 0-1 based on track status for map animation */
export function routeProgressForStatus(status: string): number {
  switch (status) {
    case "placed":
    case "restaurant_confirmed":
      return 0;
    case "preparing":
    case "ready":
      return 0.05;
    case "driver_picked_up":
      return 0.35;
    case "on_the_way":
      return 0.7;
    case "delivered":
      return 1;
    default:
      return 0.2;
  }
}

export function googleMapsDirectionsUrl(address: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

export const MOCK_DRIVER = {
  id: "drv-1",
  name: "Chris P.",
  vehicle: "Silver Honda Civic",
  initials: "CP",
  rating: 4.9,
  deliveries: 312,
};
