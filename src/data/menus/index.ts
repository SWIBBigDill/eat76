import { coreMenus } from "./core-menus";
import { cuisineDefaultOptionGroups } from "./cuisine-options";

export { coreMenus, CORE_RESTAURANT_IDS } from "./core-menus";
export type { MenuSourceItem, CoreMenu } from "./core-menus";
export * from "./optionGroups";

export function getCoreMenu(restaurantId: string) {
  return coreMenus[restaurantId];
}

export function getTemplateOptionGroups(
  cuisine: Parameters<typeof cuisineDefaultOptionGroups>[0],
  itemName: string
) {
  return cuisineDefaultOptionGroups(cuisine, itemName);
}
