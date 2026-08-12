import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Edge-safe Auth.js config: providers, pages, session strategy.
// No DB, no adapter, no Node-only callbacks — safe to import from middleware.
// The full config in src/lib/auth.ts spreads this and adds the Prisma callback.
export default {
  providers: [Google],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
} satisfies NextAuthConfig;
