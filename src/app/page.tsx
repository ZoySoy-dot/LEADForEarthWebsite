import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutUs from "@/components/AboutUs";
import WhatWeDo from "@/components/WhatWeDo";
import Foundations from "@/components/Foundations";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";

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
