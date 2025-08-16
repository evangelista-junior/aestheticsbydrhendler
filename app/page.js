import AboutUs from "@/components/Sections/AboutUs/page";
import WhatToExpect from "@/components/Sections/WhatToExpect/page";
import Contact from "@/components/Sections/Contact/page";
import Header from "@/components/Sections/Header/page";
import NavBar from "@/components/Sections/NavBar/page";
import Team from "@/components/Sections/Team/page";
import Footer from "@/components/Sections/Footer/page";
import Treatments from "@/components/Sections/Treatments/page";
import FAQ from "@/components/Sections/FAQ/page";

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
    </div>
  );
}
