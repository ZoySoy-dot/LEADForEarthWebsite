import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SectionNav from "@/components/SectionNav";
import SkipLink from "@/components/SkipLink";

const AboutUs     = dynamic(() => import("@/components/AboutUs"));
const WhatWeDo    = dynamic(() => import("@/components/WhatWeDo"));
const Foundations = dynamic(() => import("@/components/Foundations"));
const Contact     = dynamic(() => import("@/components/Contact"));
const Footer      = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <>
      <SkipLink />
      <Header />
      <SectionNav />
      <main id="main" tabIndex={-1} className="pt-[68px] focus:outline-none">
        <Hero />
        <AboutUs />
        <WhatWeDo />
        <Foundations />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
