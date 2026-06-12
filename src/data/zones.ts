export type DeliveryZoneId =
  | "kennett-square"
  | "toughkenamon-avondale"
  | "west-grove"
  | "hockessin"
  | "chadds-ford";

export type DeliveryZone = {
  id: DeliveryZoneId;
  label: string;
  subtitle: string;
  zip: string;
};

export const deliveryZones: DeliveryZone[] = [
  {
    id: "kennett-square",
    label: "Kennett Square / 19348",
    subtitle: "Core launch zone — downtown & surrounding",
    zip: "19348",
  },
  {
    id: "toughkenamon-avondale",
    label: "Toughkenamon / Avondale",
    subtitle: "Within ~10 miles of 19348",
    zip: "19348",
  },
  {
    id: "west-grove",
    label: "West Grove / Jennersville",
    subtitle: "Within ~10 miles of 19348",
    zip: "19348",
  },
  {
    id: "hockessin",
    label: "Hockessin / nearby DE",
    subtitle: "Delaware side of the delivery radius",
    zip: "19707",
  },
  {
    id: "chadds-ford",
    label: "Chadds Ford / Longwood",
    subtitle: "Baltimore Pike corridor",
    zip: "19317",
  },
];

export function getZoneById(id: DeliveryZoneId) {
  return deliveryZones.find((z) => z.id === id);
}
