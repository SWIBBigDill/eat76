"use client";

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

  return (
    <PageShell className="pb-28 lg:pb-8">
      <section className="eat-section bg-eat-soft">
        <div className="mx-auto max-w-6xl px-4">
          <Link href="/order" className="text-sm font-semibold text-eat-blue">
            ← All restaurants
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-eat-ink">{restaurant.name}</h1>
          <p className="mt-1 text-eat-muted">
            {restaurant.foodType} · {restaurant.distance} · {restaurant.deliveryTime}
          </p>
        </div>
      </section>

      <section className="eat-section pt-0">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="space-y-3">
              {menu.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
            <CartPanel />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
