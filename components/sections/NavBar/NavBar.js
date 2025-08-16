"use client";
import Image from "next/image";
import horizontal_logo from "@/public/images/horizontal_logo.png";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Button from "@/components/Primary/Button/page";
import NavHeaderButton from "./components/NavHeaderButton/page";

export default function NavBar() {
  const [showNavBar, setShowNavBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        console.log(window.scrollY);
        setShowNavBar(true);
        console.log(true);
      } else {
        setShowNavBar(false);
        console.log(showNavBar);
      }
    };

    window.addEventListener("scroll", handleScroll);
  }, []);
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={showNavBar ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 w-full bg-white shadow-2xl z-50"
    >
      <section
        className="bg-white text-gray-600 p-2 px-8 flex justify-between
        items-center"
      >
        <Image src={horizontal_logo} alt="" width={150} />

        <div className="flex gap-8 items-center">
          <NavHeaderButton>About Us</NavHeaderButton>
          <NavHeaderButton>Team</NavHeaderButton>
          <NavHeaderButton>Treatments</NavHeaderButton>
          <NavHeaderButton>What to Expect</NavHeaderButton>
          <NavHeaderButton>FAQ</NavHeaderButton>
          <NavHeaderButton>Contact</NavHeaderButton>

          {/* TODO: Add link to the booking page */}
        </div>

        <Button buttonType="primary">Book now</Button>
      </section>
    </motion.nav>
  );
}
