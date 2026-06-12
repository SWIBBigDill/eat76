import type { MenuBadge, MenuOptionGroup } from "@/lib/types";
import {
  bentoProtein,
  burgerCheese,
  burgerExtras,
  burgerTemp,
  coffeeSize,
  eggStyle,
  milkType,
  pastaProtein,
  pizzaSize,
  pizzaToppings,
  riceBeans,
  salsaHeat,
  sideChoice,
  spiceLevel,
  subBread,
  subExtras,
  sushiRollAddons,
  tacoProtein,
  thaiProtein,
  thaiSpice,
} from "./optionGroups";

export type MenuSourceItem = {
  name: string;
  description: string;
  basePrice: number;
  badges?: MenuBadge[];
  optionGroups?: MenuOptionGroup[];
};

export type CoreMenu = MenuSourceItem[];

export const coreMenus: Record<string, CoreMenu> = {
  "lily-asian-cuisine": [
    {
      name: "Spicy Crunchy Tuna Roll",
      description: "Spicy tuna, tempura crunch, scallion, sesame.",
      basePrice: 9,
      badges: ["popular", "spicy"],
      optionGroups: [spiceLevel, sushiRollAddons],
    },
    {
      name: "Shrimp Tempura Roll",
      description: "Crispy shrimp, avocado, cucumber, eel sauce.",
      basePrice: 8,
      badges: ["popular"],
      optionGroups: [sushiRollAddons],
    },
    {
      name: "Philadelphia Roll",
      description: "Smoked salmon, cream cheese, cucumber.",
      basePrice: 8.5,
      optionGroups: [sushiRollAddons],
    },
    {
      name: "Lunch Bento Box",
      description: "Choice of protein, steamed rice, salad, miso soup, and a California roll.",
      basePrice: 14,
      badges: ["popular"],
      optionGroups: [bentoProtein],
    },
    {
      name: "Chicken Teriyaki",
      description: "Grilled chicken, teriyaki glaze, steamed rice, vegetables.",
      basePrice: 15,
      optionGroups: [
        {
          id: "rice",
          name: "Rice",
          required: true,
          maxSelections: 1,
          choices: [
            { id: "white", name: "White rice", priceDelta: 0 },
            { id: "brown", name: "Brown rice", priceDelta: 0 },
            { id: "fried", name: "Fried rice", priceDelta: 2 },
          ],
        },
      ],
    },
    {
      name: "Pork Gyoza",
      description: "Pan-seared pork dumplings with ponzu dipping sauce.",
      basePrice: 7.5,
    },
    {
      name: "Edamame",
      description: "Steamed soybeans with sea salt.",
      basePrice: 5.5,
    },
    {
      name: "Miso Soup",
      description: "Tofu, wakame, scallion.",
      basePrice: 3.5,
    },
  ],

  "la-verona": [
    {
      name: "Antipasti Classico",
      description: "Prosciutto, salami, marinated olives, roasted peppers, fresh mozzarella.",
      basePrice: 16,
    },
    {
      name: "Fried Mozzarella",
      description: "Hand-breaded mozzarella, marinara, basil.",
      basePrice: 11,
    },
    {
      name: "Penne alla Vodka",
      description: "Penne in creamy tomato vodka sauce with parmesan.",
      basePrice: 19,
      optionGroups: [pastaProtein],
    },
    {
      name: "Chicken Parmigiana",
      description: "Breaded chicken cutlet, marinara, melted mozzarella, side of pasta.",
      basePrice: 22,
      optionGroups: [
        {
          id: "pasta",
          name: "Pasta choice",
          required: true,
          maxSelections: 1,
          choices: [
            { id: "penne", name: "Penne", priceDelta: 0 },
            { id: "spaghetti", name: "Spaghetti", priceDelta: 0 },
            { id: "fettuccine", name: "Fettuccine", priceDelta: 0 },
            { id: "gluten-free", name: "Gluten-free penne", priceDelta: 2 },
          ],
        },
      ],
    },
    {
      name: "Margherita Pizza",
      description: "San Marzano tomato, fresh mozzarella, basil, olive oil.",
      basePrice: 15,
      badges: ["popular"],
      optionGroups: [pizzaSize, pizzaToppings],
    },
    {
      name: "Grilled Salmon Salad",
      description: "Mixed greens, grilled salmon, lemon vinaigrette, cherry tomatoes.",
      basePrice: 18,
    },
    {
      name: "Tiramisu",
      description: "Espresso-soaked ladyfingers, mascarpone, cocoa.",
      basePrice: 9,
    },
  ],

  "talulas-table": [
    {
      name: "Market Sandwich",
      description: "Rotating seasonal sandwich on house bread with side salad.",
      basePrice: 14,
      optionGroups: [
        {
          id: "protein",
          name: "Today's protein",
          required: true,
          maxSelections: 1,
          choices: [
            { id: "turkey", name: "Roasted turkey", priceDelta: 0 },
            { id: "ham", name: "Country ham", priceDelta: 0 },
            { id: "veggie", name: "Grilled vegetables", priceDelta: 0 },
          ],
        },
        subBread,
      ],
    },
    {
      name: "Cheese Board",
      description: "Local and imported cheeses, honey, crackers, seasonal fruit.",
      basePrice: 18,
    },
    {
      name: "Seasonal Soup",
      description: "Chef's daily soup with crusty bread.",
      basePrice: 8,
    },
    {
      name: "Quiche of the Day",
      description: "Baked quiche with side salad.",
      basePrice: 12,
    },
    {
      name: "House Salad",
      description: "Mixed greens, shaved vegetables, sherry vinaigrette.",
      basePrice: 10,
      optionGroups: [
        {
          id: "protein",
          name: "Add protein",
          required: false,
          maxSelections: 1,
          choices: [
            { id: "none", name: "No protein", priceDelta: 0 },
            { id: "chicken", name: "Grilled chicken", priceDelta: 5 },
            { id: "salmon", name: "Salmon", priceDelta: 7 },
          ],
        },
      ],
    },
    {
      name: "Fresh Baked Cookie",
      description: "Two cookies, flavor rotates daily.",
      basePrice: 4,
    },
  ],

  portabellos: [
    {
      name: "Lobster Bisque",
      description: "Rich cream bisque with sherry and chives.",
      basePrice: 10,
    },
    {
      name: "Crab Cake",
      description: "Jumbo lump crab, remoulade, lemon.",
      basePrice: 16,
    },
    {
      name: "Seafood Risotto",
      description: "Arborio rice, shrimp, scallops, saffron broth.",
      basePrice: 26,
    },
    {
      name: "Pan-Seared Salmon",
      description: "Wild salmon, lemon butter, seasonal vegetables.",
      basePrice: 24,
      optionGroups: [sideChoice],
    },
    {
      name: "Eggplant Parmigiana",
      description: "Breaded eggplant, marinara, mozzarella, side of pasta.",
      basePrice: 20,
      optionGroups: [pastaProtein],
    },
    {
      name: "Tiramisu",
      description: "Classic Italian dessert.",
      basePrice: 9,
    },
  ],

  "sweet-amelias": [
    {
      name: "Amelia's Burger",
      description: "Half-pound Angus, lettuce, tomato, house sauce, brioche bun.",
      basePrice: 15,
      optionGroups: [burgerTemp, burgerCheese, burgerExtras],
    },
    {
      name: "Grilled Chicken Sandwich",
      description: "Marinated breast, avocado, chipotle aioli, ciabatta.",
      basePrice: 14,
      optionGroups: [sideChoice],
    },
    {
      name: "Mac and Cheese",
      description: "Five-cheese blend, breadcrumb crust.",
      basePrice: 12,
      optionGroups: [
        {
          id: "add-ons",
          name: "Add-ons",
          required: false,
          maxSelections: 2,
          choices: [
            { id: "bacon", name: "Bacon", priceDelta: 2 },
            { id: "lobster", name: "Lobster", priceDelta: 8 },
            { id: "truffle", name: "Truffle oil", priceDelta: 3 },
          ],
        },
      ],
    },
    {
      name: "Seasonal Salad",
      description: "Local greens, market vegetables, vinaigrette.",
      basePrice: 12,
    },
    {
      name: "Chocolate Pot de Crème",
      description: "Rich dark chocolate custard, whipped cream.",
      basePrice: 8,
    },
  ],

  "lettys-tavern": [
    {
      name: "Letty's Burger",
      description: "Half-pound patty, lettuce, tomato, pickle, tavern sauce.",
      basePrice: 14,
      optionGroups: [burgerTemp, burgerCheese, burgerExtras, sideChoice],
    },
    {
      name: "Fish and Chips",
      description: "Beer-battered cod, hand-cut fries, tartar sauce.",
      basePrice: 16,
    },
    {
      name: "Shepherd's Pie",
      description: "Ground lamb, peas, carrots, mashed potato crust.",
      basePrice: 15,
    },
    {
      name: "Chicken Wings",
      description: "Ten wings, celery, blue cheese.",
      basePrice: 13,
      optionGroups: [
        {
          id: "sauce",
          name: "Sauce",
          required: true,
          maxSelections: 1,
          choices: [
            { id: "buffalo", name: "Buffalo", priceDelta: 0 },
            { id: "bbq", name: "BBQ", priceDelta: 0 },
            { id: "garlic-parm", name: "Garlic parmesan", priceDelta: 0 },
            { id: "dry-rub", name: "Dry rub", priceDelta: 0 },
          ],
        },
      ],
    },
    {
      name: "Pub Pretzel",
      description: "Warm Bavarian pretzel, beer cheese, mustard.",
      basePrice: 9,
    },
  ],

  "michoacana-grill": [
    {
      name: "Street Taco Trio",
      description: "Three corn tortillas with onion, cilantro, lime.",
      basePrice: 12,
      optionGroups: [tacoProtein, salsaHeat],
    },
    {
      name: "Burrito Bowl",
      description: "Rice, beans, lettuce, cheese, pico, sour cream.",
      basePrice: 13.5,
      optionGroups: [tacoProtein, riceBeans, salsaHeat],
    },
    {
      name: "Quesadilla",
      description: "Flour tortilla, melted cheese, pico, sour cream.",
      basePrice: 10.5,
      optionGroups: [tacoProtein],
    },
    {
      name: "Chips and Guacamole",
      description: "Fresh guacamole, house tortilla chips.",
      basePrice: 7,
    },
    {
      name: "Horchata",
      description: "Cinnamon rice drink.",
      basePrice: 4,
      optionGroups: [
        {
          id: "size",
          name: "Size",
          required: true,
          maxSelections: 1,
          choices: [
            { id: "regular", name: "Regular", priceDelta: 0 },
            { id: "large", name: "Large", priceDelta: 1.5 },
          ],
        },
      ],
    },
  ],

  "mezzaluna-ksq": [
    {
      name: "Cheese Pizza",
      description: "Mozzarella, tomato sauce, oregano.",
      basePrice: 14,
      optionGroups: [pizzaSize, pizzaToppings],
    },
    {
      name: "Pepperoni Pizza",
      description: "Classic pepperoni, mozzarella, tomato sauce.",
      basePrice: 16,
      optionGroups: [pizzaSize, pizzaToppings],
    },
    {
      name: "Margherita Pizza",
      description: "Fresh mozzarella, basil, tomato.",
      basePrice: 15,
      optionGroups: [pizzaSize, pizzaToppings],
    },
    {
      name: "Garlic Knots",
      description: "Six knots with garlic butter and parmesan.",
      basePrice: 7,
    },
    {
      name: "Caesar Salad",
      description: "Romaine, parmesan, croutons, Caesar dressing.",
      basePrice: 9,
      optionGroups: [
        {
          id: "protein",
          name: "Add protein",
          required: false,
          maxSelections: 1,
          choices: [
            { id: "none", name: "No protein", priceDelta: 0 },
            { id: "chicken", name: "Grilled chicken", priceDelta: 4 },
          ],
        },
      ],
    },
  ],

  "sang-tong-thai": [
    {
      name: "Pad Thai",
      description: "Rice noodles, tamarind, peanuts, bean sprouts, lime.",
      basePrice: 14,
      badges: ["popular"],
      optionGroups: [thaiProtein, thaiSpice],
    },
    {
      name: "Green Curry",
      description: "Coconut curry, Thai basil, bell peppers, bamboo.",
      basePrice: 15,
      badges: ["popular", "spicy"],
      optionGroups: [thaiProtein, thaiSpice],
    },
    {
      name: "Tom Yum Soup",
      description: "Spicy lemongrass broth, mushrooms, tomatoes.",
      basePrice: 8,
      badges: ["spicy"],
      optionGroups: [
        {
          id: "protein",
          name: "Protein",
          required: true,
          maxSelections: 1,
          choices: [
            { id: "shrimp", name: "Shrimp", priceDelta: 0 },
            { id: "chicken", name: "Chicken", priceDelta: 0 },
            { id: "tofu", name: "Tofu", priceDelta: 0 },
          ],
        },
        thaiSpice,
      ],
    },
    {
      name: "Thai Basil Fried Rice",
      description: "Wok-fried rice, Thai basil, chili, egg.",
      basePrice: 13,
      optionGroups: [thaiProtein, thaiSpice],
    },
    {
      name: "Spring Rolls",
      description: "Crispy vegetable rolls, sweet chili sauce.",
      basePrice: 6,
    },
  ],

  "sams-sub-shop": [
    {
      name: "Italian Sub",
      description: "Capicola, salami, ham, provolone, oil and vinegar.",
      basePrice: 11,
      optionGroups: [subBread, subExtras],
    },
    {
      name: "Turkey Club",
      description: "Turkey, bacon, lettuce, tomato, mayo.",
      basePrice: 12,
      optionGroups: [subBread, subExtras],
    },
    {
      name: "Roast Beef Special",
      description: "Roast beef, horseradish, provolone, onion.",
      basePrice: 12.5,
      optionGroups: [subBread, subExtras],
    },
    {
      name: "Veggie Sub",
      description: "Lettuce, tomato, onion, peppers, provolone.",
      basePrice: 9.5,
      optionGroups: [subBread, subExtras],
    },
    {
      name: "Side Chips",
      description: "Kettle chips.",
      basePrice: 2.5,
    },
  ],

  "mary-pats-provisions": [
    {
      name: "Two-Egg Breakfast",
      description: "Two eggs, toast, home fries.",
      basePrice: 10,
      optionGroups: [eggStyle],
    },
    {
      name: "Avocado Toast",
      description: "Sourdough, smashed avocado, everything seasoning.",
      basePrice: 10.5,
      optionGroups: [
        {
          id: "add-ons",
          name: "Add-ons",
          required: false,
          maxSelections: 2,
          choices: [
            { id: "egg", name: "Fried egg", priceDelta: 2 },
            { id: "salmon", name: "Smoked salmon", priceDelta: 4 },
          ],
        },
      ],
    },
    {
      name: "Breakfast Burrito",
      description: "Scrambled eggs, cheese, salsa, choice of meat.",
      basePrice: 11,
      optionGroups: [
        {
          id: "meat",
          name: "Meat",
          required: true,
          maxSelections: 1,
          choices: [
            { id: "bacon", name: "Bacon", priceDelta: 0 },
            { id: "sausage", name: "Sausage", priceDelta: 0 },
            { id: "veggie", name: "Veggie", priceDelta: 0 },
          ],
        },
      ],
    },
    {
      name: "House Latte",
      description: "Double espresso, steamed milk.",
      basePrice: 5,
      optionGroups: [coffeeSize, milkType],
    },
    {
      name: "Fresh Pastry",
      description: "Bakery case selection, ask what's fresh today.",
      basePrice: 4,
    },
  ],

  "the-naked-olive": [
    {
      name: "Chicken Shawarma Plate",
      description: "Marinated chicken, rice, salad, hummus, pita.",
      basePrice: 15,
      optionGroups: [salsaHeat],
    },
    {
      name: "Falafel Wrap",
      description: "Crispy falafel, tahini, pickles, lettuce, tomato.",
      basePrice: 11,
      optionGroups: [
        {
          id: "wrap",
          name: "Wrap style",
          required: true,
          maxSelections: 1,
          choices: [
            { id: "pita", name: "Pita wrap", priceDelta: 0 },
            { id: "lavash", name: "Lavash wrap", priceDelta: 0 },
          ],
        },
      ],
    },
    {
      name: "Greek Salad",
      description: "Feta, kalamata olives, cucumber, oregano, lemon dressing.",
      basePrice: 10,
      optionGroups: [
        {
          id: "protein",
          name: "Add protein",
          required: false,
          maxSelections: 1,
          choices: [
            { id: "none", name: "No protein", priceDelta: 0 },
            { id: "chicken", name: "Grilled chicken", priceDelta: 4 },
            { id: "lamb", name: "Lamb", priceDelta: 5 },
          ],
        },
      ],
    },
    {
      name: "Hummus and Pita",
      description: "House hummus, warm pita, olive oil.",
      basePrice: 8,
    },
    {
      name: "Baklava",
      description: "Honey, pistachio, phyllo.",
      basePrice: 6,
    },
  ],

  "buddys-burgers": [
    {
      name: "Classic Cheeseburger",
      description: "Angus patty, American cheese, lettuce, tomato, Buddy's sauce.",
      basePrice: 13,
      optionGroups: [burgerTemp, burgerCheese, burgerExtras, sideChoice],
    },
    {
      name: "Crispy Chicken Sandwich",
      description: "Fried breast, pickles, slaw, brioche bun.",
      basePrice: 12,
      optionGroups: [sideChoice],
    },
    {
      name: "Loaded Fries",
      description: "Cheese sauce, bacon, ranch drizzle.",
      basePrice: 8,
    },
    {
      name: "Onion Rings",
      description: "Beer-battered rings, ranch.",
      basePrice: 6,
    },
    {
      name: "Milkshake",
      description: "Thick shake, whipped cream.",
      basePrice: 6,
      optionGroups: [
        {
          id: "flavor",
          name: "Flavor",
          required: true,
          maxSelections: 1,
          choices: [
            { id: "vanilla", name: "Vanilla", priceDelta: 0 },
            { id: "chocolate", name: "Chocolate", priceDelta: 0 },
            { id: "strawberry", name: "Strawberry", priceDelta: 0 },
            { id: "oreo", name: "Oreo", priceDelta: 1 },
          ],
        },
      ],
    },
  ],

  "caffe-pura": [
    {
      name: "House Latte",
      description: "Double shot espresso, steamed milk.",
      basePrice: 5,
      optionGroups: [coffeeSize, milkType],
    },
    {
      name: "Cappuccino",
      description: "Espresso, foamed milk.",
      basePrice: 4.5,
      optionGroups: [coffeeSize, milkType],
    },
    {
      name: "Avocado Toast",
      description: "Sourdough, smashed avocado, chili flakes.",
      basePrice: 10,
    },
    {
      name: "Quiche Slice",
      description: "Daily quiche with side salad.",
      basePrice: 9,
    },
    {
      name: "Chai Latte",
      description: "Spiced chai, steamed milk.",
      basePrice: 5.5,
      optionGroups: [coffeeSize, milkType],
    },
  ],

  "pats-pizza-kennett-square": [
    {
      name: "Cheese Pizza",
      description: "Mozzarella, tomato sauce.",
      basePrice: 14,
      optionGroups: [pizzaSize, pizzaToppings],
    },
    {
      name: "Pat's Special Pizza",
      description: "Pepperoni, sausage, mushrooms, peppers, onion.",
      basePrice: 18,
      optionGroups: [pizzaSize, pizzaToppings],
    },
    {
      name: "Buffalo Chicken Pizza",
      description: "Crispy chicken, buffalo sauce, ranch drizzle.",
      basePrice: 17,
      optionGroups: [pizzaSize, pizzaToppings],
    },
    {
      name: "Garlic Bread",
      description: "Toasted bread, garlic butter, parmesan.",
      basePrice: 6,
    },
    {
      name: "Caesar Salad",
      description: "Romaine, parmesan, croutons.",
      basePrice: 9,
    },
  ],
};

export const CORE_RESTAURANT_IDS = Object.keys(coreMenus);
