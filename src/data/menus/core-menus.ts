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
      badges: ["popular"],
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
      badges: ["gluten-free"],
      optionGroups: [sideChoice],
    },
    {
      name: "Eggplant Parmigiana",
      description: "Breaded eggplant, marinara, mozzarella, side of pasta.",
      basePrice: 20,
      badges: ["vegetarian"],
      optionGroups: [pastaProtein],
    },
    {
      name: "Grilled Octopus",
      description: "Charred octopus, white bean purée, olive oil, lemon.",
      basePrice: 18,
      badges: ["gluten-free"],
    },
    {
      name: "Caesar Salad",
      description: "Romaine, parmesan, house croutons, anchovy dressing.",
      basePrice: 11,
    },
    {
      name: "Tiramisu",
      description: "Classic Italian dessert.",
      basePrice: 9,
      badges: ["vegetarian"],
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
      badges: ["popular"],
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
      badges: ["spicy"],
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
      badges: ["vegetarian"],
    },
    {
      name: "Tavern Salad",
      description: "Mixed greens, cherry tomatoes, cucumber, ranch.",
      basePrice: 10,
      badges: ["vegetarian", "gluten-free"],
    },
    {
      name: "French Onion Soup",
      description: "Caramelized onions, gruyère crouton.",
      basePrice: 8,
      badges: ["vegetarian"],
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
      badges: ["spicy", "gluten-free"],
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
      badges: ["vegetarian"],
    },
    {
      name: "Papaya Salad",
      description: "Green papaya, peanuts, lime, fish sauce dressing.",
      basePrice: 9,
      badges: ["spicy", "gluten-free"],
    },
    {
      name: "Massaman Curry",
      description: "Mild peanut curry, potatoes, onion, jasmine rice.",
      basePrice: 15,
      optionGroups: [thaiProtein],
    },
    {
      name: "Mango Sticky Rice",
      description: "Sweet coconut rice, fresh mango.",
      basePrice: 7,
      badges: ["vegetarian", "gluten-free"],
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

  "floga-bistro": [
    {
      name: "Wood-Fired Margherita",
      description: "San Marzano tomato, fresh mozzarella, basil, olive oil.",
      basePrice: 16,
      badges: ["popular", "vegetarian"],
      optionGroups: [pizzaSize, pizzaToppings],
    },
    {
      name: "Mediterranean Flatbread",
      description: "Hummus, roasted peppers, feta, olives, arugula.",
      basePrice: 14,
      badges: ["vegetarian"],
      optionGroups: [pizzaSize],
    },
    {
      name: "Grilled Lamb Chops",
      description: "Herb-marinated lamb, tzatziki, lemon potatoes.",
      basePrice: 26,
      badges: ["gluten-free"],
      optionGroups: [sideChoice],
    },
    {
      name: "Chicken Souvlaki Plate",
      description: "Marinated chicken skewers, pita, Greek salad, tzatziki.",
      basePrice: 18,
    },
    {
      name: "Spanakopita",
      description: "Spinach and feta in flaky phyllo, side salad.",
      basePrice: 13,
      badges: ["vegetarian"],
    },
    {
      name: "Greek Salad",
      description: "Tomato, cucumber, red onion, feta, oregano vinaigrette.",
      basePrice: 11,
      badges: ["vegetarian", "gluten-free"],
    },
    {
      name: "Baklava",
      description: "Honey, pistachio, phyllo layers.",
      basePrice: 7,
      badges: ["vegetarian"],
    },
  ],

  "china-garden": [
    {
      name: "General Tso's Chicken",
      description: "Crispy chicken, sweet-spicy sauce, steamed rice.",
      basePrice: 13.5,
      badges: ["popular", "spicy"],
      optionGroups: [spiceLevel],
    },
    {
      name: "Beef with Broccoli",
      description: "Wok-seared beef, fresh broccoli, brown garlic sauce.",
      basePrice: 14,
    },
    {
      name: "Vegetable Lo Mein",
      description: "Soft noodles, mixed vegetables, light soy.",
      basePrice: 11,
      badges: ["vegetarian"],
    },
    {
      name: "Pork Dumplings",
      description: "Steamed or pan-fried, soy-ginger dipping sauce.",
      basePrice: 8,
      optionGroups: [
        {
          id: "style",
          name: "Style",
          required: true,
          maxSelections: 1,
          choices: [
            { id: "steamed", name: "Steamed", priceDelta: 0 },
            { id: "pan-fried", name: "Pan-fried", priceDelta: 0 },
          ],
        },
      ],
    },
    {
      name: "Hot and Sour Soup",
      description: "Tofu, mushrooms, bamboo, egg ribbon.",
      basePrice: 5.5,
      badges: ["spicy"],
    },
    {
      name: "Steamed Edamame",
      description: "Soybeans with sea salt.",
      basePrice: 5,
      badges: ["vegetarian", "gluten-free"],
    },
    {
      name: "Mongolian Beef",
      description: "Scallions, garlic, sweet soy glaze, jasmine rice.",
      basePrice: 15,
      badges: ["popular"],
    },
    {
      name: "Egg Foo Young",
      description: "Vegetable omelette patty, brown gravy, rice.",
      basePrice: 12,
      badges: ["vegetarian"],
    },
  ],

  "twelves-grill-cafe": [
    {
      name: "Twelves Burger",
      description: "Angus beef, aged cheddar, bacon jam, brioche.",
      basePrice: 16,
      badges: ["popular"],
      optionGroups: [burgerTemp, burgerCheese, burgerExtras, sideChoice],
    },
    {
      name: "Pan-Seared Salmon",
      description: "Farro risotto, asparagus, lemon beurre blanc.",
      basePrice: 24,
      badges: ["gluten-free"],
    },
    {
      name: "Short Rib Grilled Cheese",
      description: "Braised short rib, caramelized onion, gruyère, sourdough.",
      basePrice: 15,
    },
    {
      name: "Seasonal Soup",
      description: "Chef's daily soup with artisan bread.",
      basePrice: 8,
    },
    {
      name: "Caesar Salad",
      description: "Romaine, parmesan, house croutons.",
      basePrice: 11,
      optionGroups: [
        {
          id: "protein",
          name: "Add protein",
          required: false,
          maxSelections: 1,
          choices: [
            { id: "none", name: "No protein", priceDelta: 0 },
            { id: "chicken", name: "Grilled chicken", priceDelta: 5 },
            { id: "salmon", name: "Salmon", priceDelta: 8 },
          ],
        },
      ],
    },
    {
      name: "Chocolate Lava Cake",
      description: "Warm chocolate center, vanilla ice cream.",
      basePrice: 9,
      badges: ["vegetarian"],
    },
  ],

  "back-burner": [
    {
      name: "Crab and Artichoke Dip",
      description: "Warm dip, toasted baguette chips.",
      basePrice: 14,
      badges: ["popular"],
    },
    {
      name: "Back Burner Burger",
      description: "Half-pound Angus, smoked gouda, caramelized onions.",
      basePrice: 17,
      optionGroups: [burgerTemp, burgerCheese, burgerExtras, sideChoice],
    },
    {
      name: "Pan-Roasted Chicken",
      description: "Herb jus, mashed potatoes, seasonal vegetables.",
      basePrice: 22,
      badges: ["gluten-free"],
    },
    {
      name: "Filet Mignon",
      description: "8 oz center cut, red wine demi, truffle fries.",
      basePrice: 38,
      optionGroups: [
        {
          id: "temp",
          name: "Temperature",
          required: true,
          maxSelections: 1,
          choices: [
            { id: "medium-rare", name: "Medium rare", priceDelta: 0 },
            { id: "medium", name: "Medium", priceDelta: 0 },
            { id: "medium-well", name: "Medium well", priceDelta: 0 },
          ],
        },
      ],
    },
    {
      name: "Seasonal Salad",
      description: "Local greens, goat cheese, candied pecans, vinaigrette.",
      basePrice: 12,
      badges: ["vegetarian", "gluten-free"],
    },
    {
      name: "Crème Brûlée",
      description: "Vanilla bean custard, caramelized sugar.",
      basePrice: 9,
      badges: ["vegetarian", "gluten-free"],
    },
  ],

  "agave-mexican": [
    {
      name: "Street Taco Trio",
      description: "Three corn tortillas, onion, cilantro, lime.",
      basePrice: 13,
      badges: ["popular"],
      optionGroups: [tacoProtein, salsaHeat],
    },
    {
      name: "Enchiladas Verdes",
      description: "Corn tortillas, chicken, tomatillo sauce, crema.",
      basePrice: 15,
      optionGroups: [salsaHeat],
    },
    {
      name: "Vegetarian Burrito",
      description: "Black beans, rice, peppers, guacamole, cheese.",
      basePrice: 12,
      badges: ["vegetarian"],
      optionGroups: [salsaHeat],
    },
    {
      name: "Guacamole and Chips",
      description: "Tableside-style guacamole, fresh tortilla chips.",
      basePrice: 9,
      badges: ["vegetarian", "gluten-free"],
    },
    {
      name: "Carne Asada Plate",
      description: "Grilled steak, rice, beans, pico, tortillas.",
      basePrice: 19,
      badges: ["gluten-free"],
    },
    {
      name: "Churros",
      description: "Cinnamon sugar, chocolate dipping sauce.",
      basePrice: 7,
      badges: ["vegetarian"],
    },
  ],

  "antica-italian": [
    {
      name: "Burrata Caprese",
      description: "Fresh burrata, heirloom tomato, basil, balsamic.",
      basePrice: 14,
      badges: ["vegetarian", "gluten-free"],
    },
    {
      name: "Osso Buco",
      description: "Braised veal shank, saffron risotto, gremolata.",
      basePrice: 32,
      badges: ["popular"],
    },
    {
      name: "Rigatoni alla Vodka",
      description: "Rigatoni, creamy tomato vodka sauce, parmesan.",
      basePrice: 19,
      badges: ["vegetarian"],
      optionGroups: [pastaProtein],
    },
    {
      name: "Chicken Piccata",
      description: "Lemon-caper butter, angel hair, seasonal vegetables.",
      basePrice: 22,
    },
    {
      name: "Quattro Formaggi Pizza",
      description: "Four-cheese blend, white sauce, oregano.",
      basePrice: 17,
      badges: ["vegetarian"],
      optionGroups: [pizzaSize, pizzaToppings],
    },
    {
      name: "Tiramisu",
      description: "Espresso-soaked ladyfingers, mascarpone.",
      basePrice: 9,
      badges: ["vegetarian"],
    },
  ],

  "stubborn-goat-brewing": [
    {
      name: "Goat Burger",
      description: "Half-pound patty, goat cheese, arugula, fig jam.",
      basePrice: 15,
      badges: ["popular"],
      optionGroups: [burgerTemp, burgerExtras, sideChoice],
    },
    {
      name: "Beer-Battered Fish Tacos",
      description: "Three tacos, slaw, chipotle crema, lime.",
      basePrice: 14,
    },
    {
      name: "Brewpub Pretzel Bites",
      description: "Warm pretzel bites, beer cheese, mustard.",
      basePrice: 10,
      badges: ["vegetarian"],
    },
    {
      name: "BBQ Pulled Pork Sandwich",
      description: "Slow-smoked pork, coleslaw, pickle, brioche bun.",
      basePrice: 13,
      optionGroups: [sideChoice],
    },
    {
      name: "Seasonal IPA Flight",
      description: "Four 4 oz pours of rotating house beers.",
      basePrice: 12,
    },
    {
      name: "Loaded Nachos",
      description: "Tortilla chips, cheese, jalapeños, sour cream, salsa.",
      basePrice: 11,
      badges: ["vegetarian"],
      optionGroups: [
        {
          id: "protein",
          name: "Add protein",
          required: false,
          maxSelections: 1,
          choices: [
            { id: "none", name: "No protein", priceDelta: 0 },
            { id: "chicken", name: "Chicken", priceDelta: 4 },
            { id: "pork", name: "Pulled pork", priceDelta: 4 },
          ],
        },
      ],
    },
  ],
};

export const CORE_RESTAURANT_IDS = Object.keys(coreMenus);
