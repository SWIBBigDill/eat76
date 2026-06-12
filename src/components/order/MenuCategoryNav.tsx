"use client";

import { useEffect, useRef, useState } from "react";
import { MenuItemCard } from "@/components/order/MenuItemCard";
import type { MenuCategorySection } from "@/lib/menu-categories";

/**
 * Sticky category tabs + anchored menu sections.
 * UX pattern from Grub RestaurantView.java (UberEatsClone, Apache-2.0).
 */
type MenuCategoryNavProps = {
  sections: MenuCategorySection[];
  restaurantImage?: string;
};

export function MenuCategoryNav({ sections, restaurantImage }: MenuCategoryNavProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-120px 0px -55% 0px", threshold: 0.1 }
    );

    sectionRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  if (sections.length === 0) return null;

  function scrollToSection(id: string) {
    sectionRefs.current.get(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  }

  return (
    <>
      <div className="sticky top-[57px] z-20 -mx-4 border-b border-eat-border bg-white/95 px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-2">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToSection(section.id)}
              className={`tap-target shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeId === section.id
                  ? "bg-eat-blue text-white shadow-sm"
                  : "border border-eat-border bg-white text-eat-ink hover:border-eat-blue/40"
              }`}
            >
              {section.label}
              <span
                className={`ml-1.5 text-xs ${
                  activeId === section.id ? "text-white/80" : "text-eat-muted"
                }`}
              >
                {section.items.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-10">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            ref={(el) => {
              if (el) sectionRefs.current.set(section.id, el);
              else sectionRefs.current.delete(section.id);
            }}
            className="scroll-mt-36 space-y-3"
          >
            <h2 className="text-lg font-bold text-eat-ink">{section.label}</h2>
            {section.items.map((item) => (
              <MenuItemCard key={item.id} item={item} restaurantImage={restaurantImage} />
            ))}
          </section>
        ))}
      </div>
    </>
  );
}
