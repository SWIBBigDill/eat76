// Generates SQL to seed the Supabase restaurants table from prospects.raw.json
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const prospects = JSON.parse(
  readFileSync(join(root, "src/data/prospects.raw.json"), "utf8")
);
const manifest = JSON.parse(
  readFileSync(join(root, "src/data/imageManifest.json"), "utf8")
);

const esc = (v) => (v == null ? "null" : `'${String(v).replace(/'/g, "''")}'`);

const rows = prospects.map((p) => {
  const image = manifest[p.id]?.hero ?? null;
  return `(${esc(p.id)}, ${esc(p.name)}, ${esc(p.foodType)}, ${esc(p.address)}, ${esc(p.phone)}, ${esc(p.zone)}, ${esc(p.zip)}, ${esc(p.website)}, ${esc(image)})`;
});

const sql = `insert into restaurants (id, name, food_type, address, phone, zone, zip, website, image_url)
values
${rows.join(",\n")}
on conflict (id) do update set
  name = excluded.name,
  food_type = excluded.food_type,
  address = excluded.address,
  phone = excluded.phone,
  zone = excluded.zone,
  zip = excluded.zip,
  website = excluded.website,
  image_url = excluded.image_url;`;

writeFileSync(join(root, "supabase", "seed_restaurants.sql"), sql);
console.log(`Wrote supabase/seed_restaurants.sql with ${rows.length} restaurants`);
