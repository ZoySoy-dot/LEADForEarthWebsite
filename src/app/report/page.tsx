import type { Metadata } from "next";
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

  async function signInAction() {
    "use server";
    await signIn("google", { redirectTo: "/report" });
  }

  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/report" });
  }

  return (
    <>
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1} className="pt-[68px] focus:outline-none">
        <ReportForm
          initialSubmitter={
            user?.email
              ? { name: user.name ?? "", email: user.email }
              : undefined
          }
          signInAction={signInAction}
          signOutAction={signOutAction}
        />
      </main>
      <Footer />
    </>
  );
}
