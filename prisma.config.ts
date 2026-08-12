import "dotenv/config";
import { defineConfig } from "prisma/config";
import { PrismaNeon } from "@prisma/adapter-neon";

const runtimeUrl = process.env.DATABASE_URL;
if (!runtimeUrl) throw new Error("DATABASE_URL is not set");

// Neon's pooled connections (`-pooler` in the hostname) don't support Postgres
// advisory locks, which `prisma migrate` requires. Use DIRECT_URL (unpooled) for
// migrations, but keep DATABASE_URL (pooled) for the runtime adapter.
const migrationUrl = process.env.DIRECT_URL ?? runtimeUrl;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: migrationUrl,
  },
  adapter: async () => new PrismaNeon({ connectionString: runtimeUrl }),
});
