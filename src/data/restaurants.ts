import type { Restaurant } from "@/lib/types";

export const restaurants: Restaurant[] = [
  {
    id: "kennett-square-grill",
    name: "Kennett Square Grill",
    foodType: "American · Burgers",
    distance: "1.2 mi",
    deliveryTime: "25–35 min",
    rating: 4.7,
    zip: "19348",
  },
  {
    id: "mushroom-bistro",
    name: "Mushroom Bistro",
    foodType: "Farm-to-Table · Italian",
    distance: "0.8 mi",
    deliveryTime: "20–30 min",
    rating: 4.9,
    zip: "19348",
  },
  {
    id: "state-street-tacos",
    name: "State Street Tacos",
    foodType: "Mexican · Tacos",
    distance: "1.5 mi",
    deliveryTime: "30–40 min",
    rating: 4.6,
    zip: "19348",
  },
  {
    id: "longwood-pizza-co",
    name: "Longwood Pizza Co.",
    foodType: "Pizza · Italian",
    distance: "2.1 mi",
    deliveryTime: "35–45 min",
    rating: 4.5,
    zip: "19348",
  },
  {
    id: "chestnut-cafe",
    name: "Chestnut Café",
    foodType: "Breakfast · Coffee",
    distance: "0.6 mi",
    deliveryTime: "15–25 min",
    rating: 4.8,
    zip: "19348",
  },
  {
    id: "philly-pretzel-house",
    name: "Philly Pretzel House",
    foodType: "Snacks · Philly Favorites",
    distance: "1.0 mi",
    deliveryTime: "20–30 min",
    rating: 4.4,
    zip: "19348",
  },
];

export function getRestaurantById(id: string) {
  return restaurants.find((r) => r.id === id);
}
