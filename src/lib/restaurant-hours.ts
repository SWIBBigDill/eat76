import type { Restaurant } from "@/lib/types";

export type DayHours = { open: number; close: number } | "closed";

export type WeeklyHours = Record<
  "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat",
  DayHours
>;

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

function hoursForCuisine(foodType: string): WeeklyHours {
  const lower = foodType.toLowerCase();

  if (lower.includes("coffee") || lower.includes("cafe") || lower.includes("breakfast")) {
    return {
      sun: { open: 7, close: 15 },
      mon: { open: 7, close: 15 },
      tue: { open: 7, close: 15 },
      wed: { open: 7, close: 15 },
      thu: { open: 7, close: 15 },
      fri: { open: 7, close: 16 },
      sat: { open: 7, close: 16 },
    };
  }

  if (lower.includes("brewpub") || lower.includes("tavern") || lower.includes("bar")) {
    return {
      sun: { open: 11, close: 22 },
      mon: "closed",
      tue: { open: 11, close: 22 },
      wed: { open: 11, close: 22 },
      thu: { open: 11, close: 23 },
      fri: { open: 11, close: 24 },
      sat: { open: 10, close: 24 },
    };
  }

  if (lower.includes("chinese") || lower.includes("thai") || lower.includes("sushi")) {
    return {
      sun: { open: 11, close: 21 },
      mon: "closed",
      tue: { open: 11, close: 21 },
      wed: { open: 11, close: 21 },
      thu: { open: 11, close: 21 },
      fri: { open: 11, close: 22 },
      sat: { open: 11, close: 22 },
    };
  }

  if (lower.includes("pizza")) {
    return {
      sun: { open: 11, close: 21 },
      mon: { open: 11, close: 21 },
      tue: { open: 11, close: 21 },
      wed: { open: 11, close: 21 },
      thu: { open: 11, close: 22 },
      fri: { open: 11, close: 23 },
      sat: { open: 11, close: 23 },
    };
  }

  return {
    sun: { open: 11, close: 21 },
    mon: "closed",
    tue: { open: 11, close: 21 },
    wed: { open: 11, close: 21 },
    thu: { open: 11, close: 21 },
    fri: { open: 11, close: 22 },
    sat: { open: 10, close: 22 },
  };
}

export function getRestaurantHours(restaurant: Restaurant): WeeklyHours {
  return hoursForCuisine(restaurant.foodType);
}

export function isRestaurantOpenNow(
  restaurant: Restaurant,
  now = new Date()
): boolean {
  const hours = getRestaurantHours(restaurant);
  const dayKey = DAY_KEYS[now.getDay()];
  const today = hours[dayKey];
  if (today === "closed") return false;

  const currentHour = now.getHours() + now.getMinutes() / 60;
  const { open, close } = today;
  if (close > 24) {
    return currentHour >= open || currentHour < close - 24;
  }
  return currentHour >= open && currentHour < close;
}

export function formatHoursStatus(restaurant: Restaurant, now = new Date()): string {
  const open = isRestaurantOpenNow(restaurant, now);
  if (open) return "Open now";

  const hours = getRestaurantHours(restaurant);
  const dayKey = DAY_KEYS[now.getDay()];
  const today = hours[dayKey];

  if (today !== "closed") {
    const currentHour = now.getHours() + now.getMinutes() / 60;
    if (currentHour < today.open) {
      const h = Math.floor(today.open);
      const m = today.open % 1 === 0.5 ? "30" : "00";
      const ampm = h >= 12 ? "PM" : "AM";
      const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
      return `Opens ${display}:${m} ${ampm}`;
    }
  }

  return "Closed";
}

export function parsePrepMinutes(deliveryTime: string): number {
  const match = deliveryTime.match(/(\d+)/);
  return match ? Number(match[1]) : 30;
}

export function parseDistanceMiles(distance: string): number {
  const match = distance.match(/([\d.]+)/);
  return match ? Number(match[1]) : 99;
}
