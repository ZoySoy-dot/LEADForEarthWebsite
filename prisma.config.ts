import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma CLI config. Only used by `prisma generate` / `prisma migrate` etc.
// The runtime adapter (Neon serverless driver) lives on the PrismaClient in
// src/lib/prisma.ts — CLI commands connect directly via `datasource.url`.
//
// DATABASE_URL is Neon's pooled connection (used at runtime).
// DIRECT_URL is the unpooled connection — required by `prisma migrate` because
// Neon's pooler doesn't support the Postgres advisory locks migrations need.
const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url,
  },
});
