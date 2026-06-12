import { cuisineFromFoodType, cuisineTemplates } from "@/data/menuTemplates";
import { getCoreMenu, getTemplateOptionGroups } from "@/data/menus";
import prospectsRaw from "@/data/prospects.raw.json";
import imageManifest from "@/data/imageManifest.json";
import type { MenuItem } from "@/lib/types";

type ProspectRow = {
  id: string;
  foodType: string;
};

const manifest = imageManifest as Record<string, { hero: string | null }>;

function itemImage(restaurantId: string): string | undefined {
  return manifest[restaurantId]?.hero ?? undefined;
}

function buildMenuForRestaurant(restaurant: ProspectRow): MenuItem[] {
  const coreMenu = getCoreMenu(restaurant.id);
  const cuisine = cuisineFromFoodType(restaurant.foodType);
  const items =
    coreMenu ??
    cuisineTemplates[cuisine];

  const image = itemImage(restaurant.id);

  return items.map((item, index) => ({
    id: `${restaurant.id}-${index + 1}`,
    restaurantId: restaurant.id,
    name: item.name,
    description: item.description,
    price: item.basePrice,
    optionGroups:
      item.optionGroups ??
      getTemplateOptionGroups(cuisine, item.name),
    image,
  }));
}

export const menuItems: MenuItem[] = (prospectsRaw as ProspectRow[]).flatMap(
  buildMenuForRestaurant
);

export function getMenuByRestaurant(restaurantId: string) {
  return menuItems.filter((item) => item.restaurantId === restaurantId);
}

export function getMenuItemById(itemId: string) {
  return menuItems.find((item) => item.id === itemId);
}
