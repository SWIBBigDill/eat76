import type { MenuOptionGroup } from "@/lib/types";

export const spiceLevel: MenuOptionGroup = {
  id: "spice",
  name: "Spice level",
  required: true,
  maxSelections: 1,
  choices: [
    { id: "mild", name: "Mild", priceDelta: 0 },
    { id: "medium", name: "Medium", priceDelta: 0 },
    { id: "hot", name: "Hot", priceDelta: 0 },
    { id: "extra-hot", name: "Extra hot", priceDelta: 0 },
  ],
};

export const sushiRollAddons: MenuOptionGroup = {
  id: "roll-addons",
  name: "Add-ons",
  required: false,
  maxSelections: 3,
  choices: [
    { id: "avocado", name: "Extra avocado", priceDelta: 1.5 },
    { id: "cream-cheese", name: "Cream cheese", priceDelta: 1 },
    { id: "spicy-mayo", name: "Spicy mayo", priceDelta: 0.75 },
    { id: "crunch", name: "Crunch topping", priceDelta: 0.75 },
  ],
};

export const bentoProtein: MenuOptionGroup = {
  id: "protein",
  name: "Protein",
  required: true,
  maxSelections: 1,
  choices: [
    { id: "chicken-teriyaki", name: "Chicken teriyaki", priceDelta: 0 },
    { id: "salmon", name: "Salmon", priceDelta: 2 },
    { id: "beef", name: "Beef teriyaki", priceDelta: 1.5 },
    { id: "shrimp-tempura", name: "Shrimp tempura", priceDelta: 2 },
    { id: "tofu", name: "Tofu", priceDelta: 0 },
  ],
};

export const pizzaSize: MenuOptionGroup = {
  id: "size",
  name: "Size",
  required: true,
  maxSelections: 1,
  choices: [
    { id: "personal", name: "Personal (10\")", priceDelta: 0 },
    { id: "medium", name: "Medium (14\")", priceDelta: 4 },
    { id: "large", name: "Large (16\")", priceDelta: 7 },
    { id: "xl", name: "Extra large (18\")", priceDelta: 10 },
  ],
};

export const pizzaToppings: MenuOptionGroup = {
  id: "toppings",
  name: "Extra toppings",
  required: false,
  maxSelections: 5,
  choices: [
    { id: "pepperoni", name: "Pepperoni", priceDelta: 2 },
    { id: "sausage", name: "Italian sausage", priceDelta: 2 },
    { id: "mushroom", name: "Mushrooms", priceDelta: 1.5 },
    { id: "peppers", name: "Roasted peppers", priceDelta: 1.5 },
    { id: "onion", name: "Red onion", priceDelta: 1 },
    { id: "extra-cheese", name: "Extra cheese", priceDelta: 2 },
  ],
};

export const burgerTemp: MenuOptionGroup = {
  id: "temp",
  name: "Cook temperature",
  required: true,
  maxSelections: 1,
  choices: [
    { id: "medium-rare", name: "Medium rare", priceDelta: 0 },
    { id: "medium", name: "Medium", priceDelta: 0 },
    { id: "medium-well", name: "Medium well", priceDelta: 0 },
    { id: "well", name: "Well done", priceDelta: 0 },
  ],
};

export const burgerCheese: MenuOptionGroup = {
  id: "cheese",
  name: "Cheese",
  required: false,
  maxSelections: 1,
  choices: [
    { id: "none", name: "No cheese", priceDelta: 0 },
    { id: "american", name: "American", priceDelta: 0 },
    { id: "cheddar", name: "Cheddar", priceDelta: 0 },
    { id: "pepper-jack", name: "Pepper jack", priceDelta: 0.5 },
    { id: "blue", name: "Blue cheese", priceDelta: 1 },
  ],
};

export const burgerExtras: MenuOptionGroup = {
  id: "extras",
  name: "Add-ons",
  required: false,
  maxSelections: 4,
  choices: [
    { id: "bacon", name: "Bacon", priceDelta: 2 },
    { id: "fried-egg", name: "Fried egg", priceDelta: 1.5 },
    { id: "avocado", name: "Avocado", priceDelta: 2 },
    { id: "onion-rings", name: "Onion rings on top", priceDelta: 1.5 },
  ],
};

export const tacoProtein: MenuOptionGroup = {
  id: "protein",
  name: "Protein",
  required: true,
  maxSelections: 1,
  choices: [
    { id: "carnitas", name: "Carnitas", priceDelta: 0 },
    { id: "chicken", name: "Grilled chicken", priceDelta: 0 },
    { id: "steak", name: "Steak", priceDelta: 2 },
    { id: "chorizo", name: "Chorizo", priceDelta: 1 },
    { id: "veggie", name: "Grilled veggies", priceDelta: 0 },
  ],
};

export const riceBeans: MenuOptionGroup = {
  id: "rice-beans",
  name: "Rice and beans",
  required: true,
  maxSelections: 1,
  choices: [
    { id: "both", name: "Rice and beans", priceDelta: 0 },
    { id: "rice", name: "Rice only", priceDelta: 0 },
    { id: "beans", name: "Beans only", priceDelta: 0 },
    { id: "none", name: "No rice or beans", priceDelta: 0 },
  ],
};

export const salsaHeat: MenuOptionGroup = {
  id: "salsa",
  name: "Salsa heat",
  required: true,
  maxSelections: 1,
  choices: [
    { id: "mild-salsa", name: "Mild", priceDelta: 0 },
    { id: "medium-salsa", name: "Medium", priceDelta: 0 },
    { id: "hot-salsa", name: "Hot", priceDelta: 0 },
    { id: "verde", name: "Tomatillo verde", priceDelta: 0 },
  ],
};

export const coffeeSize: MenuOptionGroup = {
  id: "size",
  name: "Size",
  required: true,
  maxSelections: 1,
  choices: [
    { id: "small", name: "Small (12 oz)", priceDelta: 0 },
    { id: "medium", name: "Medium (16 oz)", priceDelta: 0.75 },
    { id: "large", name: "Large (20 oz)", priceDelta: 1.25 },
  ],
};

export const milkType: MenuOptionGroup = {
  id: "milk",
  name: "Milk",
  required: true,
  maxSelections: 1,
  choices: [
    { id: "whole", name: "Whole milk", priceDelta: 0 },
    { id: "oat", name: "Oat milk", priceDelta: 0.75 },
    { id: "almond", name: "Almond milk", priceDelta: 0.75 },
    { id: "skim", name: "Skim milk", priceDelta: 0 },
  ],
};

export const subBread: MenuOptionGroup = {
  id: "bread",
  name: "Bread",
  required: true,
  maxSelections: 1,
  choices: [
    { id: "white", name: "White roll", priceDelta: 0 },
    { id: "wheat", name: "Wheat roll", priceDelta: 0 },
    { id: "wrap", name: "Wrap", priceDelta: 0.5 },
  ],
};

export const subExtras: MenuOptionGroup = {
  id: "extras",
  name: "Extras",
  required: false,
  maxSelections: 4,
  choices: [
    { id: "extra-meat", name: "Double meat", priceDelta: 3 },
    { id: "extra-cheese", name: "Extra cheese", priceDelta: 1.5 },
    { id: "peppers", name: "Hot peppers", priceDelta: 0 },
    { id: "avocado", name: "Avocado", priceDelta: 2 },
  ],
};

export const thaiProtein: MenuOptionGroup = {
  id: "protein",
  name: "Protein",
  required: true,
  maxSelections: 1,
  choices: [
    { id: "chicken", name: "Chicken", priceDelta: 0 },
    { id: "shrimp", name: "Shrimp", priceDelta: 2 },
    { id: "tofu", name: "Tofu", priceDelta: 0 },
    { id: "beef", name: "Beef", priceDelta: 2.5 },
  ],
};

export const thaiSpice: MenuOptionGroup = {
  id: "spice",
  name: "Spice level",
  required: true,
  maxSelections: 1,
  choices: [
    { id: "none", name: "No spice", priceDelta: 0 },
    { id: "mild", name: "Mild (1)", priceDelta: 0 },
    { id: "medium", name: "Medium (2)", priceDelta: 0 },
    { id: "hot", name: "Hot (3)", priceDelta: 0 },
    { id: "thai-hot", name: "Thai hot (4)", priceDelta: 0 },
  ],
};

export const pastaProtein: MenuOptionGroup = {
  id: "protein",
  name: "Add protein",
  required: false,
  maxSelections: 1,
  choices: [
    { id: "none", name: "No protein", priceDelta: 0 },
    { id: "chicken", name: "Grilled chicken", priceDelta: 5 },
    { id: "shrimp", name: "Shrimp", priceDelta: 7 },
    { id: "salmon", name: "Salmon", priceDelta: 8 },
  ],
};

export const eggStyle: MenuOptionGroup = {
  id: "egg-style",
  name: "Egg style",
  required: true,
  maxSelections: 1,
  choices: [
    { id: "scrambled", name: "Scrambled", priceDelta: 0 },
    { id: "over-easy", name: "Over easy", priceDelta: 0 },
    { id: "over-medium", name: "Over medium", priceDelta: 0 },
    { id: "over-hard", name: "Over hard", priceDelta: 0 },
    { id: "poached", name: "Poached", priceDelta: 0 },
  ],
};

export const sideChoice: MenuOptionGroup = {
  id: "side",
  name: "Side",
  required: true,
  maxSelections: 1,
  choices: [
    { id: "fries", name: "French fries", priceDelta: 0 },
    { id: "salad", name: "Side salad", priceDelta: 0 },
    { id: "soup", name: "Cup of soup", priceDelta: 1 },
    { id: "coleslaw", name: "Coleslaw", priceDelta: 0 },
  ],
};
