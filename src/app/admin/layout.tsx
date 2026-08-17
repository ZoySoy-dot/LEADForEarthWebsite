import Image from "next/image";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "./nav";

export const metadata = {
  title: "Admin · LEADForEarth",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user;

  // Login page renders its own full-screen layout; skip the admin chrome there.
  if (!user) {
    return <>{children}</>;
  }

  // Signed in but not an admin? Show a dedicated denial screen. We don't
  // sign them out (they might be a report submitter using the same account).
  const admin = await prisma.adminUser.findUnique({
    where: { email: user.email!.toLowerCase() },
    select: { id: true },
  });
  if (!admin) {
    return <NotAuthorized email={user.email!} name={user.name ?? null} />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--surface-page)" }}>
      {/* Top bar: logo left, user + sign-out right */}
      <header
        className="border-b sticky top-0 z-30"
        style={{
          borderColor: "var(--border-subtle)",
          backgroundColor: "var(--header-bg-scrolled)",
          backdropFilter: "saturate(150%) blur(16px)",
          WebkitBackdropFilter: "saturate(150%) blur(16px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/logos/leadforearth-logo.png"
              alt="LEADForEarth"
              width={32}
              height={32}
              className="object-contain"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-[15px] font-bold tracking-tight" style={{ color: "var(--text-heading)" }}>
                LEADForEarth
              </span>
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: "var(--brand-mid)" }}
              >
                Admin
              </span>
            </div>
          </Link>

          <AdminNav />

          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span className="text-[13px] font-semibold" style={{ color: "var(--text-heading)" }}>
                  {user.name ?? user.email}
                </span>
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{user.email}</span>
              </div>
              {user.image && (
                <Image
                  src={user.image}
                  alt={user.name ?? "Admin"}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              )}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/admin/login" });
                }}
              >
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 text-[color:var(--text-body)] hover:bg-[color:var(--overlay-hover)]"
                >
                  Sign out
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">{children}</main>
    </div>
  );
}

function NotAuthorized({ email, name }: { email: string; name: string | null }) {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-16"
      style={{ backgroundColor: "var(--surface-page)" }}
    >
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Image
            src="/logos/leadforearth-logo.png"
            alt="LEADForEarth"
            width={72}
            height={72}
            className="object-contain"
            priority
          />
        </div>
        <div
          className="rounded-3xl p-8 sm:p-10 text-center"
          style={{ backgroundColor: "var(--surface)", boxShadow: "var(--shadow-strong)" }}
        >
          <div
            className="w-14 h-14 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--danger-bg)", color: "var(--danger-fg)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
              <circle cx="12" cy="12" r="10" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
          </div>
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-3"
            style={{ color: "var(--danger-fg)" }}
          >
            Access Restricted
          </p>
          <h1 className="text-2xl font-bold tracking-tight mb-3" style={{ color: "var(--text-heading)" }}>
            Not an admin
          </h1>
          <p className="text-[15px] leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
            You&apos;re signed in as <span className="font-semibold" style={{ color: "var(--text-body)" }}>{name ?? email}</span>, but this account doesn&apos;t have admin access. Contact the committee to be added, or sign out to use a different account.
          </p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="w-full px-6 py-3 rounded-full font-semibold text-[14px] transition-all duration-200 hover:-translate-y-px"
              style={{
                color: "var(--text-inverse)",
                backgroundColor: "var(--brand)",
                boxShadow: "var(--shadow-brand-strong)",
              }}
            >
              Sign out
            </button>
          </form>
          <div className="mt-6">
            <Link
              href="/"
              className="text-[13px] font-medium transition-colors"
              style={{ color: "var(--brand-mid)" }}
            >
              ← Back to LEADForEarth
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
