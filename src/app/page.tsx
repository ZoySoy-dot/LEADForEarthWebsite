import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SectionDivider from "@/components/SectionDivider";

const AboutUs     = dynamic(() => import("@/components/AboutUs"));
const WhatWeDo    = dynamic(() => import("@/components/WhatWeDo"));
const Foundations = dynamic(() => import("@/components/Foundations"));
const Contact     = dynamic(() => import("@/components/Contact"));
const Footer      = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-[72px]">
        <Hero />
        <AboutUs />
        <SectionDivider />
        <WhatWeDo />
        <SectionDivider />
        <Foundations />
        <SectionDivider />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
