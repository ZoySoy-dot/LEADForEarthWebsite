import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhatIsLEAD from "@/components/WhatIsLEAD";
import AboutUs from "@/components/AboutUs";
import WhatWeDo from "@/components/WhatWeDo";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-[72px]">
        <Hero />
        <WhatIsLEAD />
        <AboutUs />
        <WhatWeDo />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
