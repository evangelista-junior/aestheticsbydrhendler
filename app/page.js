import AboutUs from "@/components/Sections/AboutUs/AboutUs";
import WhatToExpect from "@/components/Sections/WhatToExpect/WhatToExpect";
import Contact from "@/components/Sections/Contact/Contact";
import Header from "@/components/Sections/Header/Header";
import NavBar from "@/components/Sections/NavBar/NavBar";
import Team from "@/components/Sections/Team/Team";
import Footer from "@/components/Sections/Footer/Footer";
import Treatments from "@/components/Sections/Treatments/Treatments";
import FAQ from "@/components/Sections/FAQ/FAQ";

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
