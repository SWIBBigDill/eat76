import type { MenuItem } from "@/lib/types";

/**
 * Groups flat menu items into scroll sections with tab labels.
 * Pattern ported from Codename One Grub RestaurantView category tabs
 * (sergeyCodenameOne/UberEatsClone, Apache-2.0).
 */
export type MenuCategorySection = {
  id: string;
  label: string;
  items: MenuItem[];
};

function slugify(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function groupMenuIntoCategories(items: MenuItem[]): MenuCategorySection[] {
  if (items.length === 0) return [];
  if (items.length <= 3) {
    return [{ id: "menu", label: "Menu", items }];
  }

  const popularCount = Math.min(2, items.length);
  const rest = items.slice(popularCount);
  const midpoint = Math.ceil(rest.length / 2);

  const sections: MenuCategorySection[] = [
    { id: "popular", label: "Popular", items: items.slice(0, popularCount) },
    { id: "mains", label: "Mains", items: rest.slice(0, midpoint) },
  ];

  const more = rest.slice(midpoint);
  if (more.length > 0) {
    sections.push({ id: "more", label: "Sides & more", items: more });
  }

  return sections.map((s) => ({ ...s, id: slugify(s.label) || s.id }));
}
