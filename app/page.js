import Header from "@/components/sections/Header";
import AboutUs from "@/components/sections/AboutUs";
import Team from "@/components/sections/Team";
import Treatments from "@/app/(marketing)/treatments/page";
import WhatToExpect from "@/components/sections/WhatToExpect";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/app/(marketing)/contact/page";

export default function Home() {
  return (
    <div>
      <Header />
      <AboutUs />
      <Team />
      <Treatments />
      <WhatToExpect />
      <FAQ />
      <Contact />
    </div>
  );
}
