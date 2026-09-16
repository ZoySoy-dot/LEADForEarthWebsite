// Fill reports.country for rows filed before the column existed.
//
// Usage: node scripts/backfill-report-country.mjs [--dry]
//
// Reads the canonical roster straight out of src/data/schools.ts so there is
// only ever one list of schools to maintain. Only touches rows where country
// is still NULL, so it is safe to re-run after adding schools to the roster.

import "dotenv/config";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import pkg from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const { PrismaClient } = pkg;
const __dirname = dirname(fileURLToPath(import.meta.url));
const dry = process.argv.includes("--dry");

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add it to .env first.");
  process.exit(1);
}

const src = readFileSync(resolve(__dirname, "..", "src", "data", "schools.ts"), "utf8");

// name -> sector, from the LEAD_SCHOOLS entries.
const byName = new Map();
for (const m of src.matchAll(/name:\s*"([^"]+)",\s*country:\s*"([^"]+)"/g)) {
  byName.set(m[1].toLowerCase(), m[2]);
}

// Legacy names map to a current school, whose sector we then reuse.
const aliasBlock = src.match(/LEGACY_SCHOOL_ALIASES[^{]*\{([\s\S]*?)\n\};/);
if (aliasBlock) {
  for (const m of aliasBlock[1].matchAll(/"([^"]+)"\s*:\s*"([^"]+)"/g)) {
    const sector = byName.get(m[2].toLowerCase());
    if (sector) byName.set(m[1].toLowerCase(), sector);
  }
}

console.log(`Roster: ${byName.size} school names across ${new Set(byName.values()).size} sectors`);

const adapter = new PrismaNeon({ connectionString: url });
const prisma = new PrismaClient({ adapter });

const pending = await prisma.report.findMany({
  where: { country: null },
  select: { id: true, schoolName: true },
});

console.log(`Reports missing a sector: ${pending.length}`);

let matched = 0;
const unmatched = [];

for (const r of pending) {
  const sector = byName.get(r.schoolName.trim().toLowerCase());
  if (!sector) {
    unmatched.push(r.schoolName);
    continue;
  }
  matched++;
  if (!dry) {
    await prisma.report.update({ where: { id: r.id }, data: { country: sector } });
  }
}

console.log(`${dry ? "Would set" : "Set"} sector on ${matched} report(s).`);

if (unmatched.length) {
  console.log(`\n${unmatched.length} school name(s) not on the roster:`);
  for (const n of [...new Set(unmatched)]) console.log(`  - ${n}`);
  console.log("\nThese stay NULL. Either add them to src/data/schools.ts or fix the");
  console.log("school name on the report in /admin, then re-run this script.");
}

await prisma.$disconnect();
