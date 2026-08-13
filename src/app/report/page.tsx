import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReportForm from "@/components/ReportForm";
import SkipLink from "@/components/SkipLink";
import { auth, signIn, signOut } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Report | LEADForEarth",
  description:
    "Submit your institution's #LEADforEarth campaign report.",
};

export default async function ReportPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <>
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1} className="pt-[68px] focus:outline-none">
        {user?.email ? (
          <ReportForm
            initialSubmitter={{
              name: user.name ?? "",
              email: user.email,
            }}
            signOutAction={async () => {
              "use server";
              await signOut({ redirectTo: "/report" });
            }}
          />
        ) : (
          <SignInPrompt />
        )}
      </main>
      <Footer />
    </>
  );
}

function SignInPrompt() {
  return (
    <section
      className="min-h-[70vh] flex items-center justify-center px-6 py-16"
      style={{ backgroundColor: "#fafbfa" }}
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
          className="bg-white rounded-3xl p-8 sm:p-10"
          style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 20px 60px -20px rgba(26,92,42,0.18)" }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-3 text-center"
            style={{ color: "#2d8c3e" }}
          >
            #LEADforEarth Report
          </p>
          <h1
            className="text-3xl font-bold tracking-tight mb-3 text-center"
            style={{ color: "#0d3d1a" }}
          >
            Sign in to submit
          </h1>
          <p className="text-[15px] text-gray-500 text-center leading-relaxed mb-8">
            We ask you to sign in with Google so your submitter info auto-fills and the report portal stays spam-free.
          </p>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/report" });
            }}
          >
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full font-semibold text-[14px] text-white transition-all duration-200 hover:-translate-y-px"
              style={{
                backgroundColor: "#1a5c2a",
                boxShadow: "0 8px 20px -6px rgba(26,92,42,0.45)",
              }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                <path fill="#fff" d="M21.35 11.1H12v3.2h5.35c-.23 1.4-1.63 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.95S8.78 6.5 12 6.5c1.83 0 3.06.78 3.76 1.45l2.57-2.47C16.7 3.9 14.55 3 12 3 6.98 3 3 6.98 3 12s3.98 9 9 9c5.2 0 8.63-3.65 8.63-8.78 0-.6-.07-1.05-.15-1.52z" />
              </svg>
              Sign in with Google
            </button>
          </form>

          <p className="mt-6 text-xs text-gray-400 text-center leading-relaxed">
            Only your name and email are stored as the submitter of this report. Your Google profile isn&apos;t used for anything else.
          </p>
        </div>
      </div>
    </section>
  );
}
