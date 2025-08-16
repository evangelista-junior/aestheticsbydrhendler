import Header from "@/components/sections/Header";
import NavBar from "@/components/sections/NavBar";
import AboutUs from "@/components/sections/AboutUs";
import Team from "@/components/sections/Team";
import Treatments from "@/components/sections/Treatments";
import WhatToExpect from "@/components/sections/WhatToExpect";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="w-screen h-dvh ">
      <NavBar />
      <Header />
      <AboutUs />
      <Team />
      <Treatments />
      <WhatToExpect />
      <FAQ />
      <Contact />
      <Footer />
      test
    </div>
  );
}
