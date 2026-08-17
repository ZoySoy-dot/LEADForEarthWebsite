import Image from "next/image";
import { signIn, auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Sign In · LEADForEarth",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();
  if (session) redirect(params.callbackUrl ?? "/admin");

  const error = params.error;
  const callbackUrl = params.callbackUrl ?? "/admin";

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-16"
      style={{ backgroundColor: "var(--surface-page)" }}
    >
      <div className="w-full max-w-md">
        {/* Logo above the card */}
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
          className="rounded-3xl p-8 sm:p-10"
          style={{ backgroundColor: "var(--surface)", boxShadow: "var(--shadow-strong)" }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-3 text-center"
            style={{ color: "var(--brand-mid)" }}
          >
            Committee Access
          </p>
          <h1
            className="text-3xl font-bold tracking-tight mb-3 text-center"
            style={{ color: "var(--text-heading)" }}
          >
            Sign in to Admin
          </h1>
          <p className="text-[15px] text-center leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
            Use your authorized Google account to view submitted #LEADforEarth reports.
          </p>

          {error && (
            <div
              className="mb-5 px-4 py-3 rounded-xl border text-sm text-center"
              style={{
                backgroundColor: "var(--danger-bg)",
                borderColor: "var(--danger-border)",
                color: "var(--danger-fg)",
              }}
            >
              {error === "AccessDenied"
                ? "This Google account isn't on the admin allowlist. Contact the committee to be added."
                : "Sign in failed. Please try again."}
            </div>
          )}

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: callbackUrl });
            }}
          >
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full font-semibold text-[14px] transition-all duration-200 hover:-translate-y-px"
              style={{
                color: "var(--text-inverse)",
                backgroundColor: "var(--brand)",
                boxShadow: "var(--shadow-brand-strong)",
              }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                <path fill="currentColor" d="M21.35 11.1H12v3.2h5.35c-.23 1.4-1.63 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.95S8.78 6.5 12 6.5c1.83 0 3.06.78 3.76 1.45l2.57-2.47C16.7 3.9 14.55 3 12 3 6.98 3 3 6.98 3 12s3.98 9 9 9c5.2 0 8.63-3.65 8.63-8.78 0-.6-.07-1.05-.15-1.52z" />
              </svg>
              Sign in with Google
            </button>
          </form>

          <p className="mt-6 text-xs text-center leading-relaxed" style={{ color: "var(--text-subtle)" }}>
            Access is limited to committee members. All sign-ins are logged.
          </p>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-[13px] font-medium transition-colors"
            style={{ color: "var(--brand-mid)" }}
          >
            ← Back to LEADForEarth
          </a>
        </div>
      </div>
    </main>
  );
}
