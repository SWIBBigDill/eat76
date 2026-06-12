import type { MenuBadge } from "@/lib/types";

const badgeStyles: Record<MenuBadge, string> = {
  popular: "bg-eat-blue/10 text-eat-blue",
  spicy: "bg-eat-red/10 text-eat-red",
  vegetarian: "bg-green-100 text-green-800",
  "gluten-free": "bg-amber-100 text-amber-900",
};

const badgeLabels: Record<MenuBadge, string> = {
  popular: "Popular",
  spicy: "Spicy",
  vegetarian: "V",
  "gluten-free": "GF",
};

export function MenuItemBadges({ badges }: { badges?: MenuBadge[] }) {
  if (!badges || badges.length === 0) return null;

  return (
    <div className="mb-1 flex flex-wrap gap-1.5">
      {badges.map((badge) => (
        <span
          key={badge}
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badgeStyles[badge]}`}
          title={
            badge === "vegetarian"
              ? "Vegetarian"
              : badge === "gluten-free"
                ? "Gluten-free"
                : badgeLabels[badge]
          }
        >
          {badgeLabels[badge]}
        </span>
      ))}
    </div>
  );
}
