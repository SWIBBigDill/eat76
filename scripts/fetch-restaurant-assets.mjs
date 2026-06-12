/**
 * Fetches hero/food images from restaurant-owned websites (not delivery apps).
 * Run: node scripts/fetch-restaurant-assets.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "restaurants");
const MANIFEST_PATH = path.join(ROOT, "src", "data", "imageManifest.json");

const prospects = JSON.parse(
  fs.readFileSync(path.join(ROOT, "src", "data", "prospects.raw.json"), "utf8")
);

const LOGO_HINTS = /logo|icon|favicon|badge|transparent|blur_2|w_84|w_147|w_120|pad=100/i;
const FOOD_HINTS = /food|dish|menu|hero|about|section|cocktail|pizza|sushi|pasta|burger|taco|interior|dining|plate|meal|grill|bistro|kitchen|restaurant/i;

function pickBestImage(html, pageUrl) {
  const candidates = new Set();

  const ogPatterns = [
    /property=["']og:image["'][^>]*content=["']([^"']+)["']/gi,
    /content=["']([^"']+)["'][^>]*property=["']og:image["']/gi,
  ];
  for (const re of ogPatterns) {
    let m;
    while ((m = re.exec(html))) candidates.add(m[1]);
  }

  const imgRe = /(?:src|data-src)=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp)(?:\?[^"']*)?)["']/gi;
  let im;
  while ((im = imgRe.exec(html))) candidates.add(im[1]);

  const scored = [...candidates].map((url) => {
    let score = 0;
    if (LOGO_HINTS.test(url)) score -= 5;
    if (FOOD_HINTS.test(url)) score += 4;
    if (/\.(jpg|jpeg|webp)/i.test(url)) score += 2;
    if (/w_\d+/i.test(url)) {
      const w = Number((url.match(/w_(\d+)/i) || [])[1]);
      if (w >= 400) score += 3;
      if (w < 200) score -= 2;
    }
    if (/squarespace-cdn|wixstatic|getbento|spotapps|menusifu|wsimg/i.test(url)) score += 1;
    return { url, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.find((s) => s.score > 0)?.url ?? scored[0]?.url ?? null;
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Eat76-Onboarding/1.0 (local MVP asset fetch)" },
    signal: AbortSignal.timeout(20000),
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function downloadImage(url, destPath) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Eat76-Onboarding/1.0" },
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`Image HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buf);
}

function extFromUrl(url) {
  const m = url.match(/\.(jpe?g|png|webp)/i);
  return m ? m[1].toLowerCase().replace("jpeg", "jpg") : "jpg";
}

function writePlaceholder(r) {
  const colors = {
    sushi: "#0047BA",
    italian: "#B91036",
    mexican: "#ED174C",
    pizza: "#002F7A",
    default: "#6B7280",
  };
  const key = (r.foodType || "").toLowerCase();
  let color = colors.default;
  if (key.includes("sushi") || key.includes("japanese") || key.includes("asian")) color = colors.sushi;
  else if (key.includes("italian")) color = colors.italian;
  else if (key.includes("mexican")) color = colors.mexican;
  else if (key.includes("pizza")) color = colors.pizza;

  const initial = (r.name || "?").replace(/^The\s+/i, "").charAt(0).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" fill="none">
  <rect width="400" height="240" fill="${color}" opacity="0.12"/>
  <rect width="400" height="240" fill="url(#g)"/>
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${color}" stop-opacity="0.25"/><stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.9"/></linearGradient></defs>
  <text x="200" y="130" text-anchor="middle" font-family="Arial,sans-serif" font-size="72" font-weight="700" fill="${color}">${initial}</text>
  <text x="200" y="190" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#111827">${(r.name || "").replace(/&/g, "&amp;").slice(0, 28)}</text>
</svg>`;
  const heroPath = `/restaurants/${r.id}/hero.svg`;
  fs.mkdirSync(path.join(ROOT, "public", "restaurants", r.id), { recursive: true });
  fs.writeFileSync(path.join(ROOT, "public", heroPath.slice(1)), svg);
  return heroPath;
}

async function processRestaurant(r) {
  const manifestEntry = { hero: null, items: {} };

  if (!r.website) {
    manifestEntry.hero = writePlaceholder(r);
    return { id: r.id, status: "placeholder", ...manifestEntry };
  }

  try {
    const html = await fetchHtml(r.website);
    const imageUrl = pickBestImage(html, r.website);
    if (!imageUrl) {
      manifestEntry.hero = writePlaceholder(r);
      return { id: r.id, status: "placeholder", ...manifestEntry };
    }
    const ext = extFromUrl(imageUrl);
    const heroPath = `/restaurants/${r.id}/hero.${ext}`;
    await downloadImage(imageUrl, path.join(ROOT, "public", heroPath.slice(1)));
    manifestEntry.hero = heroPath;
    return { id: r.id, status: "ok", source: imageUrl, ...manifestEntry };
  } catch (err) {
    manifestEntry.hero = writePlaceholder(r);
    return { id: r.id, status: "placeholder-error", error: String(err.message || err), ...manifestEntry };
  }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const results = [];
  const batchSize = 5;

  for (let i = 0; i < prospects.length; i += batchSize) {
    const batch = prospects.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processRestaurant));
    results.push(...batchResults);
    console.log(`Processed ${Math.min(i + batchSize, prospects.length)} / ${prospects.length}`);
  }

  const manifest = Object.fromEntries(
    results.map((r) => [r.id, { hero: r.hero, status: r.status, source: r.source }])
  );
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  const ok = results.filter((r) => r.status === "ok").length;
  console.log(`Done. ${ok}/${results.length} hero images saved. Manifest: ${MANIFEST_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
