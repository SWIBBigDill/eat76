import type { DeliveryZoneId } from "@/data/zones";
import type { Restaurant } from "@/lib/types";
import prospectsRaw from "@/data/prospects.raw.json";
import imageManifest from "@/data/imageManifest.json";

type ProspectRow = {
  id: string;
  name: string;
  foodType: string;
  address: string;
  phone: string | null;
  zone: DeliveryZoneId;
  zip: string;
  website: string | null;
  distance: string;
  deliveryTime: string;
  rating: number;
};

const manifest = imageManifest as Record<
  string,
  { hero: string | null; status?: string }
>;

function heroFor(id: string): string | undefined {
  const entry = manifest[id];
  if (entry?.hero) return entry.hero;
  return undefined;
}

export const restaurants: Restaurant[] = (prospectsRaw as ProspectRow[]).map(
  (p) => ({
    id: p.id,
    name: p.name,
    foodType: p.foodType,
    address: p.address,
    phone: p.phone ?? undefined,
    zone: p.zone,
    distance: p.distance,
    deliveryTime: p.deliveryTime,
    rating: p.rating,
    zip: p.zip,
    website: p.website ?? undefined,
    image: heroFor(p.id),
  })
);

export function getRestaurantById(id: string) {
  return restaurants.find((r) => r.id === id);
}

export function getRestaurantsByZone(zone: DeliveryZoneId) {
  return restaurants.filter((r) => r.zone === zone);
}
