import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutUs from "@/components/AboutUs";
import WhatWeDo from "@/components/WhatWeDo";
import Foundations from "@/components/Foundations";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-[72px]">
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
