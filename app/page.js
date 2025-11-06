import Header from "@/features/Header";
import AboutUs from "@/features/AboutUs";
import Team from "@/app/(marketing)/team/page";
import Treatments from "@/app/(marketing)/treatments/page";
import WhatToExpect from "@/app/(marketing)/what-to-expect/page";
import Contact from "@/app/(marketing)/contact/page";
import FAQ from "./(marketing)/faq/page";

export default function Home() {
  return (
    <div>
      <Header />
      <AboutUs />
      <Team />
      <WhatToExpect />
      <Treatments />
      <FAQ />
      <Contact />
    </div>
  );
}
