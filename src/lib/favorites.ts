const FAVORITES_KEY = "eat76-favorites";

export function loadFavoriteIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function isFavorite(restaurantId: string): boolean {
  return loadFavoriteIds().includes(restaurantId);
}

export function toggleFavorite(restaurantId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const current = loadFavoriteIds();
    const next = current.includes(restaurantId)
      ? current.filter((id) => id !== restaurantId)
      : [...current, restaurantId];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    return next.includes(restaurantId);
  } catch {
    return false;
  }
}
