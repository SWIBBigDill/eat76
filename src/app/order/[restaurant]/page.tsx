"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { CartPanel } from "@/components/order/CartPanel";
import { MenuItemCard } from "@/components/order/MenuItemCard";
import { useCart } from "@/context/CartContext";
import { getMenuByRestaurant } from "@/data/menuItems";
import { getRestaurantById } from "@/data/restaurants";

export default function RestaurantMenuPage() {
  const params = useParams();
  const restaurantId = params.restaurant as string;
  const restaurant = getRestaurantById(restaurantId);
  const menu = getMenuByRestaurant(restaurantId);
  const { setRestaurant, restaurantId: cartRestaurantId, clearCart } = useCart();

  useEffect(() => {
    if (restaurant) {
      if (cartRestaurantId && cartRestaurantId !== restaurant.id) {
        clearCart();
      }
      setRestaurant(restaurant.id, restaurant.name);
    }
  }, [restaurant, cartRestaurantId, setRestaurant, clearCart]);

  if (!restaurant) {
    return (
      <PageShell>
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-eat-ink">Restaurant not found</h1>
          <Link href="/order" className="mt-4 inline-block text-eat-blue font-semibold">
            ← Back to restaurants
          </Link>
        </div>
      </PageShell>
    );
  }

  const heroSrc =
    restaurant.image ?? `/restaurants/${restaurant.id}/hero.svg`;

  return (
    <PageShell className="pb-28 lg:pb-8">
      <section className="relative bg-eat-soft">
        <div className="relative mx-auto max-w-6xl">
          <div className="relative h-48 w-full sm:h-56 md:h-64">
            <Image
              src={heroSrc}
              alt={`${restaurant.name} — ${restaurant.foodType}`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-5">
            <Link href="/order" className="text-sm font-semibold text-white/90 hover:text-white">
              ← All restaurants
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              {restaurant.name}
            </h1>
            <p className="mt-1 text-sm text-white/90">
              {restaurant.foodType} · {restaurant.distance} · {restaurant.deliveryTime}
            </p>
          </div>
        </div>
      </section>

      <section className="eat-section pt-4">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-eat-muted">
            <span>{restaurant.address}</span>
            {restaurant.phone && <span>{restaurant.phone}</span>}
            {restaurant.website && (
              <a
                href={restaurant.website}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-eat-blue hover:underline"
              >
                Restaurant website
              </a>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="space-y-3">
              {menu.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  restaurantImage={heroSrc}
                />
              ))}
            </div>
            <CartPanel />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
