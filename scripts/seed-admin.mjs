// Grant admin access to a Google email.
// Usage: node scripts/seed-admin.mjs <email> [name]
// Example: node scripts/seed-admin.mjs jane@school.edu.ph "Jane Doe"

import "dotenv/config";
import pkg from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
const { PrismaClient } = pkg;

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add it to .env first.");
  process.exit(1);
}

const email = process.argv[2];
const name = process.argv[3] ?? null;

if (!email) {
  console.error("Usage: node scripts/seed-admin.mjs <email> [name]");
  process.exit(1);
}

const adapter = new PrismaNeon({ connectionString: url });
const prisma = new PrismaClient({ adapter });

const admin = await prisma.adminUser.upsert({
  where: { email: email.toLowerCase() },
  update: { name },
  create: { email: email.toLowerCase(), name },
});

console.log(`Admin granted: ${admin.email}${admin.name ? ` (${admin.name})` : ""}`);
await prisma.$disconnect();
