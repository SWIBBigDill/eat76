import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SVG_PATH = path.join(ROOT, "public", "logo.svg");
const OUT_DIR = path.join(ROOT, "public", "icons");

async function main() {
  const { default: sharp } = await import("sharp");
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const svg = fs.readFileSync(SVG_PATH);
  const sizes = [192, 512];

  for (const size of sizes) {
    const out = path.join(OUT_DIR, `icon-${size}.png`);
    await sharp(svg).resize(size, size).png().toFile(out);
    console.log(`Wrote ${out}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
