import type { MenuOptionGroup } from "@/lib/types";
import type { CuisineKey } from "@/data/menuTemplates";
import {
  burgerCheese,
  burgerExtras,
  burgerTemp,
  coffeeSize,
  milkType,
  pizzaSize,
  pizzaToppings,
  riceBeans,
  salsaHeat,
  sideChoice,
  spiceLevel,
  subBread,
  sushiRollAddons,
  tacoProtein,
  thaiProtein,
  thaiSpice,
} from "./optionGroups";

/** Default option groups per cuisine for template menus (non-core restaurants). */
export function cuisineDefaultOptionGroups(
  cuisine: CuisineKey,
  itemName: string
): MenuOptionGroup[] | undefined {
  const lower = itemName.toLowerCase();

  switch (cuisine) {
    case "sushi":
      if (lower.includes("roll") || lower.includes("bento")) {
        return lower.includes("bento")
          ? [
              {
                id: "protein",
                name: "Protein",
                required: true,
                maxSelections: 1,
                choices: [
                  { id: "chicken", name: "Chicken teriyaki", priceDelta: 0 },
                  { id: "salmon", name: "Salmon", priceDelta: 2 },
                  { id: "tofu", name: "Tofu", priceDelta: 0 },
                ],
              },
            ]
          : [spiceLevel, sushiRollAddons];
      }
      return undefined;

    case "pizza":
      if (lower.includes("pizza") || lower.includes("pie")) {
        return [pizzaSize, pizzaToppings];
      }
      return undefined;

    case "mexican":
      if (
        lower.includes("taco") ||
        lower.includes("burrito") ||
        lower.includes("bowl") ||
        lower.includes("quesadilla")
      ) {
        return [tacoProtein, riceBeans, salsaHeat];
      }
      return undefined;

    case "burgers":
      if (lower.includes("burger")) {
        return [burgerTemp, burgerCheese, burgerExtras];
      }
      if (lower.includes("sandwich")) {
        return [sideChoice];
      }
      return undefined;

    case "american":
      if (lower.includes("burger")) {
        return [burgerTemp, burgerCheese, sideChoice];
      }
      if (lower.includes("sandwich")) {
        return [sideChoice];
      }
      return undefined;

    case "thai":
      if (
        lower.includes("pad") ||
        lower.includes("curry") ||
        lower.includes("fried rice")
      ) {
        return [thaiProtein, thaiSpice];
      }
      return undefined;

    case "italian":
      if (lower.includes("pasta") || lower.includes("parmigiana")) {
        return [
          {
            id: "pasta",
            name: "Pasta choice",
            required: true,
            maxSelections: 1,
            choices: [
              { id: "penne", name: "Penne", priceDelta: 0 },
              { id: "spaghetti", name: "Spaghetti", priceDelta: 0 },
              { id: "fettuccine", name: "Fettuccine", priceDelta: 0 },
            ],
          },
        ];
      }
      if (lower.includes("pizza")) {
        return [pizzaSize, pizzaToppings];
      }
      return undefined;

    case "sandwiches":
      return [subBread];

    case "cafe":
    case "breakfast":
      if (lower.includes("latte") || lower.includes("coffee") || lower.includes("chai")) {
        return [coffeeSize, milkType];
      }
      if (lower.includes("breakfast") || lower.includes("egg")) {
        return [
          {
            id: "egg-style",
            name: "Egg style",
            required: true,
            maxSelections: 1,
            choices: [
              { id: "scrambled", name: "Scrambled", priceDelta: 0 },
              { id: "over-easy", name: "Over easy", priceDelta: 0 },
              { id: "over-medium", name: "Over medium", priceDelta: 0 },
            ],
          },
        ];
      }
      return undefined;

    case "chinese":
      if (
        lower.includes("chicken") ||
        lower.includes("beef") ||
        lower.includes("rice")
      ) {
        return [spiceLevel];
      }
      return undefined;

    case "mediterranean":
      if (lower.includes("plate") || lower.includes("wrap") || lower.includes("shawarma")) {
        return [salsaHeat];
      }
      return undefined;

    case "pub":
      if (lower.includes("burger")) {
        return [burgerTemp, sideChoice];
      }
      return undefined;

    default:
      return undefined;
  }
}
