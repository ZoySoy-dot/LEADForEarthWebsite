import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { prisma } from "@/lib/prisma";

// Full Auth.js instance for Node runtime (server components, API routes).
// Middleware uses a lighter instance built from authConfig alone (see middleware.ts)
// because Prisma can't run on the Edge runtime.
//
// Two-tier Google sign-in:
//   - Any Google user can sign in (used by report submitters).
//   - Admin access to /admin is gated by the admin_users allowlist,
//     enforced server-side in the /admin layout; NOT here.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    async signIn({ user }) {
      // Google guarantees the email is verified; accept any Google account.
      if (!user?.email) return false;

      // Best-effort: if this email happens to be an admin, refresh their
      // last-login stamp + profile. Ignored for non-admin submitters.
      await prisma.adminUser.updateMany({
        where: { email: user.email.toLowerCase() },
        data: {
          lastLoginAt: new Date(),
          name: user.name ?? undefined,
          image: user.image ?? undefined,
        },
      }).catch(() => { /* non-fatal */ });

      return true;
    },
  },
});
