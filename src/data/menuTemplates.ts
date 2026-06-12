export type MenuTemplateItem = {
  name: string;
  description: string;
  basePrice: number;
  optionGroups?: import("@/lib/types").MenuOptionGroup[];
};

export type CuisineKey =
  | "sushi"
  | "italian"
  | "mexican"
  | "pizza"
  | "american"
  | "thai"
  | "chinese"
  | "mediterranean"
  | "breakfast"
  | "burgers"
  | "sandwiches"
  | "bakery"
  | "cafe"
  | "dessert"
  | "steakhouse"
  | "pub"
  | "fast-food"
  | "default";

export const cuisineTemplates: Record<CuisineKey, MenuTemplateItem[]> = {
  sushi: [
    { name: "Spicy Tuna Roll", description: "Spicy tuna, cucumber, crunch.", basePrice: 9 },
    { name: "Shrimp Tempura Roll", description: "Crispy shrimp, avocado, eel sauce.", basePrice: 8.5 },
    { name: "Pork Gyoza", description: "Pan-seared pork dumplings.", basePrice: 7.5 },
    { name: "Bento Box Lunch", description: "Protein, rice, salad, and roll.", basePrice: 14 },
    { name: "Miso Soup", description: "Classic miso with tofu and scallion.", basePrice: 3.5 },
  ],
  italian: [
    { name: "Antipasti Classico", description: "Cured meats, olives, marinated vegetables.", basePrice: 16 },
    { name: "Fried Mozzarella", description: "Crispy mozzarella with marinara.", basePrice: 11 },
    { name: "Chicken Parmigiana", description: "Breaded chicken, marinara, melted mozzarella.", basePrice: 22 },
    { name: "Pasta Primavera", description: "Seasonal vegetables, garlic, olive oil.", basePrice: 19 },
    { name: "Tiramisu", description: "Espresso-soaked ladyfingers, mascarpone.", basePrice: 9 },
  ],
  mexican: [
    { name: "Street Taco Trio", description: "Three tacos: carnitas, chicken, or veggie.", basePrice: 12 },
    { name: "Burrito Bowl", description: "Rice, beans, salsa, guac, protein.", basePrice: 13.5 },
    { name: "Chips & Guacamole", description: "Fresh guac, house tortilla chips.", basePrice: 7 },
    { name: "Quesadilla", description: "Flour tortilla, cheese, pico, sour cream.", basePrice: 10.5 },
    { name: "Horchata", description: "Cinnamon rice drink.", basePrice: 4 },
  ],
  pizza: [
    { name: "Cheese Pizza", description: "Mozzarella, tomato sauce, oregano.", basePrice: 14 },
    { name: "Pepperoni Pie", description: "Classic pepperoni, mozzarella.", basePrice: 16 },
    { name: "Margherita", description: "Fresh mozzarella, basil, tomato.", basePrice: 15 },
    { name: "Garlic Knots", description: "Six knots, garlic butter, parmesan.", basePrice: 7 },
    { name: "Caesar Salad", description: "Romaine, parmesan, croutons.", basePrice: 9 },
  ],
  american: [
    { name: "House Burger", description: "Angus beef, lettuce, tomato, pickle.", basePrice: 14 },
    { name: "Grilled Chicken Sandwich", description: "Marinated breast, brioche, aioli.", basePrice: 13 },
    { name: "French Fries", description: "Hand-cut, sea salt.", basePrice: 5 },
    { name: "Soup of the Day", description: "Chef's daily selection.", basePrice: 6 },
    { name: "Iced Tea", description: "Fresh brewed.", basePrice: 3 },
  ],
  thai: [
    { name: "Pad Thai", description: "Rice noodles, tamarind, peanuts, lime.", basePrice: 14 },
    { name: "Green Curry", description: "Coconut curry, basil, vegetables.", basePrice: 15 },
    { name: "Tom Yum Soup", description: "Spicy lemongrass broth, shrimp.", basePrice: 8 },
    { name: "Thai Basil Fried Rice", description: "Wok-fried rice, basil, chili.", basePrice: 13 },
    { name: "Spring Rolls", description: "Vegetable rolls, sweet chili.", basePrice: 6 },
  ],
  chinese: [
    { name: "General Tso's Chicken", description: "Crispy chicken, sweet heat sauce.", basePrice: 13 },
    { name: "Beef & Broccoli", description: "Wok-seared beef, garlic sauce.", basePrice: 14 },
    { name: "Fried Rice", description: "Egg, peas, carrots, soy.", basePrice: 10 },
    { name: "Egg Roll", description: "Two crispy pork egg rolls.", basePrice: 5 },
    { name: "Wonton Soup", description: "Pork wontons, scallion broth.", basePrice: 5.5 },
  ],
  mediterranean: [
    { name: "Chicken Shawarma Plate", description: "Rice, salad, hummus, pita.", basePrice: 15 },
    { name: "Falafel Wrap", description: "Crispy falafel, tahini, pickles.", basePrice: 11 },
    { name: "Greek Salad", description: "Feta, olives, cucumber, oregano.", basePrice: 10 },
    { name: "Hummus & Pita", description: "House hummus, warm pita.", basePrice: 8 },
    { name: "Baklava", description: "Honey, pistachio, phyllo.", basePrice: 6 },
  ],
  breakfast: [
    { name: "Two-Egg Breakfast", description: "Eggs any style, toast, potatoes.", basePrice: 10 },
    { name: "Pancake Stack", description: "Three buttermilk pancakes, syrup.", basePrice: 9 },
    { name: "Breakfast Burrito", description: "Eggs, cheese, salsa, choice of meat.", basePrice: 11 },
    { name: "Avocado Toast", description: "Sourdough, smashed avocado.", basePrice: 10.5 },
    { name: "Coffee", description: "Fresh brewed.", basePrice: 3 },
  ],
  burgers: [
    { name: "Classic Cheeseburger", description: "Angus patty, cheddar, house sauce.", basePrice: 13 },
    { name: "Crispy Chicken Sandwich", description: "Fried breast, pickles, slaw.", basePrice: 12 },
    { name: "Loaded Fries", description: "Cheese, bacon, ranch.", basePrice: 8 },
    { name: "Onion Rings", description: "Beer-battered, ranch.", basePrice: 6 },
    { name: "Milkshake", description: "Vanilla, chocolate, or strawberry.", basePrice: 6 },
  ],
  sandwiches: [
    { name: "Italian Sub", description: "Capicola, salami, provolone, oil & vinegar.", basePrice: 11 },
    { name: "Turkey Club", description: "Turkey, bacon, lettuce, tomato.", basePrice: 12 },
    { name: "Roast Beef Special", description: "Roast beef, horseradish, provolone.", basePrice: 12.5 },
    { name: "Side Chips", description: "Kettle chips.", basePrice: 2.5 },
    { name: "Pickle Spear", description: "House pickle.", basePrice: 1 },
  ],
  bakery: [
    { name: "Chocolate Chip Cookie", description: "Fresh baked, two cookies.", basePrice: 4 },
    { name: "Croissant", description: "Butter croissant.", basePrice: 3.5 },
    { name: "Slice of Cake", description: "Rotating daily flavor.", basePrice: 6 },
    { name: "Coffee Cake", description: "Cinnamon streusel slice.", basePrice: 5 },
    { name: "Latte", description: "Espresso, steamed milk.", basePrice: 4.5 },
  ],
  cafe: [
    { name: "House Latte", description: "Double shot, steamed milk.", basePrice: 5 },
    { name: "Avocado Toast", description: "Sourdough, everything seasoning.", basePrice: 10 },
    { name: "Quiche Slice", description: "Daily quiche with side salad.", basePrice: 9 },
    { name: "Chai Latte", description: "Spiced chai, steamed milk.", basePrice: 5.5 },
    { name: "Scone", description: "Blueberry or cranberry.", basePrice: 4 },
  ],
  dessert: [
    { name: "Ice Cream Scoop", description: "Two scoops, rotating flavors.", basePrice: 5 },
    { name: "Sundae", description: "Ice cream, toppings, whipped cream.", basePrice: 7 },
    { name: "Milkshake", description: "Thick shake, whipped top.", basePrice: 6.5 },
    { name: "Churros", description: "Cinnamon sugar, chocolate dip.", basePrice: 6 },
    { name: "Brownie", description: "Warm fudge brownie.", basePrice: 4.5 },
  ],
  steakhouse: [
    { name: "Filet Mignon", description: "8 oz center cut, chef's preparation.", basePrice: 38 },
    { name: "Ribeye", description: "12 oz USDA choice, herb butter.", basePrice: 34 },
    { name: "Caesar Salad", description: "Romaine, parmesan, croutons.", basePrice: 11 },
    { name: "Loaded Baked Potato", description: "Butter, sour cream, chives.", basePrice: 6 },
    { name: "Chocolate Cake", description: "Rich layer cake.", basePrice: 9 },
  ],
  pub: [
    { name: "Fish & Chips", description: "Beer-battered cod, fries, tartar.", basePrice: 16 },
    { name: "Shepherd's Pie", description: "Ground lamb, mashed potato crust.", basePrice: 15 },
    { name: "Bangers & Mash", description: "Sausages, mashed potatoes, gravy.", basePrice: 14 },
    { name: "Pub Pretzel", description: "Warm pretzel, beer cheese.", basePrice: 9 },
    { name: "House Ale", description: "Local draft (ID required).", basePrice: 7 },
  ],
  "fast-food": [
    { name: "Combo Meal", description: "Entree, side, and drink.", basePrice: 10 },
    { name: "Signature Sandwich", description: "House specialty sandwich.", basePrice: 7 },
    { name: "Fries", description: "Classic fries.", basePrice: 3 },
    { name: "Side Salad", description: "Garden salad.", basePrice: 4 },
    { name: "Soft Drink", description: "Fountain drink.", basePrice: 2.5 },
  ],
  default: [
    { name: "Chef's Special", description: "Today's featured dish.", basePrice: 16 },
    { name: "House Salad", description: "Mixed greens, vinaigrette.", basePrice: 9 },
    { name: "Soup of the Day", description: "Ask your server.", basePrice: 6 },
    { name: "Side Order", description: "Seasonal side.", basePrice: 5 },
    { name: "Fountain Drink", description: "Soft drink.", basePrice: 2.5 },
  ],
};

export function cuisineFromFoodType(foodType: string): CuisineKey {
  const t = foodType.toLowerCase();
  if (t.includes("sushi") || t.includes("japanese")) return "sushi";
  if (t.includes("italian") && !t.includes("pizza")) return "italian";
  if (t.includes("mexican")) return "mexican";
  if (t.includes("pizza")) return "pizza";
  if (t.includes("thai")) return "thai";
  if (t.includes("chinese") || t.includes("asian fusion") || t.includes("asian")) return t.includes("fusion") ? "chinese" : t.includes("chinese") ? "chinese" : "sushi";
  if (t.includes("mediterranean")) return "mediterranean";
  if (t.includes("breakfast")) return "breakfast";
  if (t.includes("burger") || t.includes("chicken")) return "burgers";
  if (t.includes("sandwich") || t.includes("subs") || t.includes("deli")) return "sandwiches";
  if (t.includes("bakery") || t.includes("dessert")) return t.includes("bakery") ? "bakery" : "dessert";
  if (t.includes("cafe") || t.includes("coffee") || t.includes("tea")) return "cafe";
  if (t.includes("steak")) return "steakhouse";
  if (t.includes("pub") || t.includes("british") || t.includes("tavern") || t.includes("brewpub") || t.includes("beer")) return "pub";
  if (t.includes("fast food") || t.includes("chain")) return "fast-food";
  if (t.includes("american") || t.includes("new american") || t.includes("market")) return "american";
  if (t.includes("ice cream")) return "dessert";
  return "default";
}
