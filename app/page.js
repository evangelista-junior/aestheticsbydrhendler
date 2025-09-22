import Header from "@/components/features/Header";
import AboutUs from "@/components/features/AboutUs";
import Team from "@/components/features/Team";
import Treatments from "@/app/(marketing)/treatments/page";
import WhatToExpect from "@/components/features/WhatToExpect";
import FAQ from "@/components/features/FAQ";
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
