import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

// Two-tier Google sign-in:
//   - Any Google user can sign in (used by report submitters).
//   - Admin access to /admin is gated by the admin_users allowlist,
//     enforced server-side in the /admin layout — NOT here.
// No adapter — sessions are JWTs (no DB tables for accounts/sessions).
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async signIn({ user }) {
      // Google guarantees the email is verified — accept any Google account.
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
