import Header from "@/components/header";
import Hero from "@/components/hero";
import Statement from "@/components/statement";
import Work from "@/components/work";
import Services from "@/components/services";
import Toolkit from "@/components/toolkit";
import Architecture from "@/components/architecture";
import Process from "@/components/process";
import Contact from "@/components/contact";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Statement />
        <Work />
        <Services />
        <Architecture />
        <Toolkit />
        <Process />
      </main>
      <Contact />
    </>
  );
}
