import Header from "@/features/Header";
import AboutUs from "@/features/AboutUs";
import Team from "@/features/Team";
import Treatments from "@/app/(marketing)/treatments/page";
import WhatToExpect from "@/features/WhatToExpect";
import FAQ from "@/features/FAQ";
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
