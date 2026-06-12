import { restaurants } from "@/data/restaurants";

/**
 * Cuisine chip labels for browse filters.
 * Inspired by Grub FilterView category toggles (UberEatsClone, Apache-2.0).
 */
export function getCuisineFilters(): { label: string; match: string }[] {
  const counts = new Map<string, number>();

  for (const r of restaurants) {
    const key = r.foodType.trim();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 12)
    .map(([label]) => ({ label, match: label }));
}

export function restaurantMatchesCuisine(foodType: string, cuisine: string | null): boolean {
  if (!cuisine) return true;
  return foodType.toLowerCase().includes(cuisine.toLowerCase());
}
