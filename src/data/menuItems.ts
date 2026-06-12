import type { MenuItem } from "@/lib/types";

export const menuItems: MenuItem[] = [
  // Kennett Square Grill
  {
    id: "ksg-burger",
    restaurantId: "kennett-square-grill",
    name: "Kennett Classic Burger",
    description: "Angus beef, cheddar, lettuce, tomato, house sauce.",
    price: 14.5,
  },
  {
    id: "ksg-fries",
    restaurantId: "kennett-square-grill",
    name: "Hand-Cut Fries",
    description: "Crispy fries with sea salt.",
    price: 5.5,
  },
  {
    id: "ksg-shake",
    restaurantId: "kennett-square-grill",
    name: "Milkshake",
    description: "Vanilla, chocolate, or strawberry.",
    price: 6.0,
  },
  // Mushroom Bistro
  {
    id: "mb-pasta",
    restaurantId: "mushroom-bistro",
    name: "Wild Mushroom Pasta",
    description: "Local mushrooms, garlic cream, fresh herbs.",
    price: 18.0,
  },
  {
    id: "mb-salad",
    restaurantId: "mushroom-bistro",
    name: "Garden Salad",
    description: "Mixed greens, balsamic, goat cheese.",
    price: 11.0,
  },
  {
    id: "mb-bread",
    restaurantId: "mushroom-bistro",
    name: "Garlic Bread",
    description: "Toasted ciabatta with herb butter.",
    price: 6.5,
  },
  // State Street Tacos
  {
    id: "sst-taco-trio",
    restaurantId: "state-street-tacos",
    name: "Street Taco Trio",
    description: "Carnitas, chicken, or veggie — your pick.",
    price: 12.0,
  },
  {
    id: "sst-burrito",
    restaurantId: "state-street-tacos",
    name: "Burrito Bowl",
    description: "Rice, beans, salsa, guac, protein.",
    price: 13.5,
  },
  {
    id: "sst-chips",
    restaurantId: "state-street-tacos",
    name: "Chips & Guac",
    description: "Fresh guacamole, house tortilla chips.",
    price: 7.0,
  },
  // Longwood Pizza Co.
  {
    id: "lpc-margherita",
    restaurantId: "longwood-pizza-co",
    name: "Margherita Pizza",
    description: "San Marzano, fresh mozzarella, basil.",
    price: 16.0,
  },
  {
    id: "lpc-pepperoni",
    restaurantId: "longwood-pizza-co",
    name: "Pepperoni Pie",
    description: "Classic pepperoni, mozzarella, oregano.",
    price: 17.5,
  },
  {
    id: "lpc-wings",
    restaurantId: "longwood-pizza-co",
    name: "Buffalo Wings",
    description: "Eight wings, blue cheese, celery.",
    price: 11.5,
  },
  // Chestnut Café
  {
    id: "cc-avocado-toast",
    restaurantId: "chestnut-cafe",
    name: "Avocado Toast",
    description: "Sourdough, smashed avo, everything seasoning.",
    price: 10.5,
  },
  {
    id: "cc-latte",
    restaurantId: "chestnut-cafe",
    name: "House Latte",
    description: "Double shot, steamed milk.",
    price: 5.25,
  },
  {
    id: "cc-omelette",
    restaurantId: "chestnut-cafe",
    name: "Veggie Omelette",
    description: "Peppers, onions, spinach, cheddar.",
    price: 12.0,
  },
  // Philly Pretzel House
  {
    id: "pph-pretzel",
    restaurantId: "philly-pretzel-house",
    name: "Philly Soft Pretzel",
    description: "Warm pretzel with mustard.",
    price: 4.5,
  },
  {
    id: "pph-cheesesteak",
    restaurantId: "philly-pretzel-house",
    name: "Mini Cheesesteak",
    description: "Shaved steak, whiz, onions on a roll.",
    price: 9.75,
  },
  {
    id: "pph-dip",
    restaurantId: "philly-pretzel-house",
    name: "Pretzel Bites & Dip",
    description: "Bites with beer cheese dip.",
    price: 8.0,
  },
];

export function getMenuByRestaurant(restaurantId: string) {
  return menuItems.filter((item) => item.restaurantId === restaurantId);
}
