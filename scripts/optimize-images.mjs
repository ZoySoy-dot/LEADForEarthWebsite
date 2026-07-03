import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, extname, basename } from "path";

const PUBLIC_DIR = new URL("../public", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

const configs = {
  "leadforearth-logo.png": { width: 400, height: 400, quality: 90 },
  "sdg-wheel.png":         { width: 500, height: 500, quality: 85 },
  "sdg-un-emblem.png":     { width: 400, height: 130, quality: 85 },
};
const SDG_CONFIG = { width: 200, height: 200, quality: 85 };

async function optimizePng(filePath, width, height, quality) {
  const before = (await stat(filePath)).size;
  const img = sharp(filePath).resize(width, height, { fit: "inside", withoutEnlargement: true });
  const buf = await img.png({ quality, compressionLevel: 9, palette: false }).toBuffer();
  if (buf.length < before) {
    const { writeFile } = await import("fs/promises");
    await writeFile(filePath, buf);
    const saved = ((before - buf.length) / before * 100).toFixed(1);
    console.log(`✓ ${basename(filePath)}: ${kb(before)} → ${kb(buf.length)} (${saved}% smaller)`);
  } else {
    console.log(`– ${basename(filePath)}: already optimal (${kb(before)})`);
  }
}

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

const files = await readdir(PUBLIC_DIR);
for (const file of files) {
  if (extname(file).toLowerCase() !== ".png") continue;
  const full = join(PUBLIC_DIR, file);
  const cfg = configs[file] ?? (file.startsWith("sdg-") ? SDG_CONFIG : null);
  if (!cfg) continue;
  await optimizePng(full, cfg.width, cfg.height, cfg.quality);
}
