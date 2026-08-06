import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GuidelinesContent from "@/components/GuidelinesContent";
import SkipLink from "@/components/SkipLink";

export const metadata: Metadata = {
  title: "Guidelines | LEADForEarth",
  description:
    "Official guidelines for the #LEADforEarth initiative, a district-wide digital movement uniting Lasallian schools across East Asia against climate change.",
};

export default function GuidelinesPage() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1} className="pt-[68px] focus:outline-none">
        <GuidelinesContent />
      </main>
      <Footer />
    </>
  );
}
