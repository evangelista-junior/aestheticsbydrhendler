import Header from "@/components/sections/Header";
import AboutUs from "@/components/sections/AboutUs";
import Team from "@/components/sections/Team";
import Treatments from "@/components/sections/Treatments";
import WhatToExpect from "@/components/sections/WhatToExpect";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <AboutUs />
      <Team />
      <Treatments />
      <WhatToExpect />
      <FAQ />
      <Contact />
    </>
  );
}
