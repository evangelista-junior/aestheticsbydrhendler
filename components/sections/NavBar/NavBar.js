"use client";
import Image from "next/image";
import Link from "next/link";
import horizontal_logo from "@/public/images/logo_horizontal_blackandwhite.png";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/primary/Button";
import NavHeaderButton from "./components/NavHeaderButton";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const [showNavBar, setShowNavBar] = useState(false);
  const [open, setOpen] = useState(false);

  const currentPathName = usePathname();
  const notHomePage = currentPathName != "/";

  //Handle the main NavBar whenever the page gets scrolled or if it's being shown in any page but home "/"
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 80;

      setShowNavBar((!open && isScrolled) || notHomePage);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open, notHomePage]);

  //Add listener for whenever the user clicks outside the drawer
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Locks the scrolling when drawer menu is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [open]);

  const handleClickSideMenu = () => {
    setShowNavBar(false);
    setOpen(!open);
  };

  const links = [
    { label: "About Us", href: "#about" },
    { label: "Team", href: "#team" },
    { label: "Treatments", href: "#treatments" },
    { label: "What to Expect", href: "#expect" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <motion.nav
        initial={notHomePage ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
        animate={showNavBar ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={
          notHomePage
            ? "sticky top-0 left-0 w-full z-50"
            : "fixed top-0 left-0 w-full shadow-2xl z-50"
        }
      >
        <div className="bg-white text-gray-600 px-4 py-2 lg:px-8 flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center"
            aria-label="Go to homepage"
          >
            <Image src={horizontal_logo} alt="" width={140} priority />
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex gap-6 items-center">
            {links.map((l) => (
              <NavHeaderButton asChild key={l.label}>
                <Link href={l.href}>{l.label}</Link>
              </NavHeaderButton>
            ))}

            <Link href="/booking">
              <Button buttonType="primary" className="ml-8">
                Book now
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md border border-gray-200 active:scale-95 "
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-controls="mobile-drawer"
            aria-expanded={open}
          >
            <Menu size={24} aria-hidden="true" focusable="false" />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 bg-easyDark/50 z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.aside
              id="mobile-drawer"
              className="fixed top-0 right-0 h-dvh w-80 max-w-[85vw] bg-white text-gray-600 z-[70] shadow-2xl flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              role="dialog"
              aria-modal="true"
              aria-label="Main menu"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <Link
                  href="/"
                  className="inline-flex items-center"
                  aria-label="Go to homepage"
                >
                  <Image src={horizontal_logo} alt="" width={120} />
                </Link>
                <button
                  className="p-2 rounded-md border border-gray-200 hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={24} aria-hidden="true" focusable="false" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-4 py-4">
                <ul className="space-y-2">
                  {links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="block rounded-lg px-3 py-2 text-lg active:bg-gray-100"
                        onClick={() => handleClickSideMenu()}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-4">
                  <Link href="/booking">
                    <Button
                      buttonType="primary"
                      className="w-full justify-center"
                    >
                      Book now
                    </Button>
                  </Link>
                </div>
              </nav>

              <div className="px-4 pb-5 text-xs text-gray-400">
                © {new Date().getFullYear()} Aesthetics by Dr Hendler
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
