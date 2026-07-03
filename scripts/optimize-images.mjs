import sharp from "sharp";
import { readdir, stat, readFile, writeFile } from "fs/promises";
import { join, extname, relative } from "path";
import { fileURLToPath } from "url";

const PROJECT_ROOT = fileURLToPath(new URL("..", import.meta.url));
const PUBLIC_DIR = join(PROJECT_ROOT, "public");

const DEFAULT_MAX_DIMENSION = 1024;
const MIN_SAVINGS_BYTES = 512;
const RASTER_EXTS = new Set([".png", ".jpg", ".jpeg"]);

const overrides = {
  "public/logos/logo-icon.png":            { max: 256 },
  "public/logos/leadforearth-logo.png":    { max: 512 },
  "public/logos/La-Star-Salle_White.png":  { max: 400 },
  "public/logos/LEAD @ 15.png":            { max: 256 },
  "public/sdg/sdg-wheel.png":              { max: 760 },
  "public/sdg/sdg-un-emblem.png":          { max: 400 },
};

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const pct = (n) => `${(n * 100).toFixed(1)}%`;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (RASTER_EXTS.has(extname(entry.name).toLowerCase())) {
      out.push(full);
    }
  }
  return out;
}

function configFor(absPath) {
  const key = relative(PROJECT_ROOT, absPath).replace(/\\/g, "/");
  const cfg = overrides[key];
  const sdgGoal = key.match(/public\/sdg\/sdg-\d+\.png$/);
  return {
    max: cfg?.max ?? (sdgGoal ? 420 : DEFAULT_MAX_DIMENSION),
  };
}

async function optimize(file) {
  const before = (await stat(file)).size;
  const cfg = configFor(file);
  const ext = extname(file).toLowerCase();

  let pipeline = sharp(file).resize({
    width: cfg.max,
    height: cfg.max,
    fit: "inside",
    withoutEnlargement: true,
  });

  if (ext === ".png") {
    pipeline = pipeline.png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 });
  } else {
    pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true });
  }

  const buf = await pipeline.toBuffer();
  const saved = before - buf.length;
  const rel = relative(PROJECT_ROOT, file).replace(/\\/g, "/");

  if (saved < MIN_SAVINGS_BYTES) {
    console.log(`– ${rel}  ${kb(before)}  (already optimal)`);
    return { before, after: before };
  }

  await writeFile(file, buf);
  console.log(`✓ ${rel}  ${kb(before)} → ${kb(buf.length)}  (-${pct(saved / before)})`);
  return { before, after: buf.length };
}

const files = await walk(PUBLIC_DIR);
console.log(`Scanning ${files.length} raster image(s) under public/\n`);

let totalBefore = 0;
let totalAfter = 0;
for (const file of files) {
  try {
    const r = await optimize(file);
    totalBefore += r.before;
    totalAfter += r.after;
  } catch (err) {
    const rel = relative(PROJECT_ROOT, file).replace(/\\/g, "/");
    console.warn(`! ${rel}  skipped: ${err.message}`);
  }
}

const totalSaved = totalBefore - totalAfter;
console.log(
  `\nTotal: ${kb(totalBefore)} → ${kb(totalAfter)}  (saved ${kb(totalSaved)}, -${totalBefore ? pct(totalSaved / totalBefore) : "0%"})`
);
