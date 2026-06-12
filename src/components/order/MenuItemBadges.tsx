import type { MenuBadge } from "@/lib/types";

const badgeStyles: Record<MenuBadge, string> = {
  popular: "bg-eat-blue/10 text-eat-blue",
  spicy: "bg-eat-red/10 text-eat-red",
};

const badgeLabels: Record<MenuBadge, string> = {
  popular: "Popular",
  spicy: "Spicy",
};

export function MenuItemBadges({ badges }: { badges?: MenuBadge[] }) {
  if (!badges || badges.length === 0) return null;

  return (
    <div className="mb-1 flex flex-wrap gap-1.5">
      {badges.map((badge) => (
        <span
          key={badge}
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badgeStyles[badge]}`}
        >
          {badgeLabels[badge]}
        </span>
      ))}
    </div>
  );
}
