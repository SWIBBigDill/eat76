import type {
  MenuItem,
  MenuOptionGroup,
  SelectedOption,
} from "@/lib/types";

export type OptionSelections = Record<string, string[]>;

export function buildLineId(
  menuItemId: string,
  selectedOptions: SelectedOption[]
): string {
  if (!selectedOptions.length) return menuItemId;
  const parts = selectedOptions
    .flatMap((o) => o.choiceIds)
    .sort();
  return `${menuItemId}:${parts.join(",")}`;
}

export function formatOptionSummary(selectedOptions: SelectedOption[]): string {
  return selectedOptions.flatMap((o) => o.choiceNames).join(" · ");
}

export function formatItemDisplayName(
  name: string,
  optionSummary?: string
): string {
  return optionSummary ? `${name} · ${optionSummary}` : name;
}

export function calculateItemPrice(
  basePrice: number,
  optionGroups: MenuOptionGroup[] | undefined,
  selections: OptionSelections
): number {
  if (!optionGroups?.length) return basePrice;
  let total = basePrice;
  for (const group of optionGroups) {
    for (const choiceId of selections[group.id] ?? []) {
      const choice = group.choices.find((c) => c.id === choiceId);
      if (choice) total += choice.priceDelta;
    }
  }
  return Math.round(total * 100) / 100;
}

export function buildSelectedOptions(
  optionGroups: MenuOptionGroup[] | undefined,
  selections: OptionSelections
): SelectedOption[] {
  if (!optionGroups?.length) return [];
  return optionGroups
    .map((group) => {
      const choiceIds = selections[group.id] ?? [];
      if (!choiceIds.length) return null;
      const choiceNames = choiceIds
        .map((id) => group.choices.find((c) => c.id === id)?.name)
        .filter((n): n is string => Boolean(n));
      return {
        groupId: group.id,
        groupName: group.name,
        choiceIds,
        choiceNames,
      };
    })
    .filter((o): o is SelectedOption => o !== null);
}

export function areRequiredOptionsMet(
  optionGroups: MenuOptionGroup[] | undefined,
  selections: OptionSelections
): boolean {
  if (!optionGroups?.length) return true;
  for (const group of optionGroups) {
    const count = (selections[group.id] ?? []).length;
    const min = group.minSelections ?? (group.required ? 1 : 0);
    const max = group.maxSelections ?? (group.required ? 1 : 999);
    if (count < min || count > max) return false;
  }
  return true;
}

export function toggleChoice(
  group: MenuOptionGroup,
  current: string[],
  choiceId: string
): string[] {
  const max = group.maxSelections ?? 1;
  if (max === 1) {
    return current.includes(choiceId) ? [] : [choiceId];
  }
  if (current.includes(choiceId)) {
    return current.filter((id) => id !== choiceId);
  }
  if (current.length >= max) return current;
  return [...current, choiceId];
}

export function itemHasOptions(item: MenuItem): boolean {
  return Boolean(item.optionGroups?.length);
}

export function getDefaultSelections(
  optionGroups: MenuOptionGroup[] | undefined
): OptionSelections {
  const selections: OptionSelections = {};
  if (!optionGroups) return selections;
  for (const group of optionGroups) {
    if (group.required && group.choices.length === 1) {
      selections[group.id] = [group.choices[0].id];
    }
  }
  return selections;
}
