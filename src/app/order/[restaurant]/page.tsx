"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { CartPanel } from "@/components/order/CartPanel";
import { MenuCategoryNav } from "@/components/order/MenuCategoryNav";
import { useCart } from "@/context/CartContext";
import { getMenuByRestaurant } from "@/data/menuItems";
import { getRestaurantById } from "@/data/restaurants";
import { groupMenuIntoCategories } from "@/lib/menu-categories";

export default function RestaurantMenuPage() {
  const params = useParams();
  const restaurantId = params.restaurant as string;
  const restaurant = getRestaurantById(restaurantId);
  const menu = getMenuByRestaurant(restaurantId);
  const {
    setRestaurant,
    restaurantId: cartRestaurantId,
    clearCart,
    itemCount,
    total,
    isCartOpen,
    setCartOpen,
  } = useCart();

  useEffect(() => {
    if (restaurant) {
      if (cartRestaurantId && cartRestaurantId !== restaurant.id) {
        clearCart();
      }
      setRestaurant(restaurant.id, restaurant.name);
    }
  }, [restaurant, cartRestaurantId, setRestaurant, clearCart]);

  const menuSections = useMemo(() => groupMenuIntoCategories(menu), [menu]);

  if (!restaurant) {
    return (
      <PageShell className={`md:pb-0 ${itemCount > 0 ? "pb-36" : "pb-20"}`}>
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-eat-ink">Restaurant not found</h1>
          <Link href="/order" className="mt-4 inline-block text-eat-blue font-semibold">
            ← Back to restaurants
          </Link>
        </div>
      </PageShell>
    );
  }

  const imageSrc = restaurant.image ?? `/restaurants/${restaurant.id}/hero.svg`;

  return (
    <PageShell className={`md:pb-0 ${itemCount > 0 ? "pb-36" : "pb-20"}`}>
      {/* Hero banner */}
      <section className="relative">
        <div className="relative h-48 w-full bg-eat-soft sm:h-56 md:h-64">
          <Image
            src={imageSrc}
            alt={`${restaurant.name}, local restaurant`}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-6">
            <Link
              href="/order"
              className="inline-flex items-center gap-1 text-sm font-semibold text-white/90 hover:text-white"
            >
              ← All restaurants
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-white drop-shadow-sm sm:text-3xl line-clamp-2">
              {restaurant.name}
            </h1>
            <p className="mt-1 text-sm text-white/85">
              {restaurant.foodType} · {restaurant.distance} · {restaurant.deliveryTime}
            </p>
            <span className="mt-2 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur">
              ★ {restaurant.rating}
            </span>
          </div>
        </div>
      </section>

      <section className="eat-section pt-6">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <MenuCategoryNav sections={menuSections} restaurantImage={imageSrc} />
            <CartPanel />
          </div>
        </div>
      </section>

      {/* Sticky add-to-cart bar when items in cart (mobile) */}
      {itemCount > 0 && !isCartOpen && (
        <div className="fixed inset-x-0 z-40 border-t border-eat-border bg-white px-4 py-3 shadow-lg lg:hidden bottom-[calc(4.5rem+env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="tap-target flex w-full items-center justify-between rounded-2xl bg-eat-blue px-5 py-3.5 text-white"
          >
            <span className="font-semibold">
              View cart · {itemCount} item{itemCount !== 1 ? "s" : ""}
            </span>
            <span className="font-bold">${total.toFixed(2)}</span>
          </button>
        </div>
      )}

    </PageShell>
  );
}
