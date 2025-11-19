"use client";
import Image from "next/image";
import Link from "next/link";
import horizontal_logo from "@/public/images/horizontal_logo_blackandwhite.png";
import {
  motion,
  AnimatePresence,
  useTransform,
  useScroll,
} from "framer-motion";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import NavHeaderButton from "./components/NavHeaderButton";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const [showNavBar, setShowNavBar] = useState(false);
  const [hideNavBar, setHideNavBar] = useState(false);
  const [openSideMenu, setOpenSideMenu] = useState(false);

  const { scrollY } = useScroll();

  const urlPath = usePathname();
  const notHomePage = urlPath != "/";

  //Handle the main NavBar whenever the page gets scrolled or if it's being shown in any page but home "/"
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 80;

      setShowNavBar(
        (!openSideMenu && isScrolled && !hideNavBar) || notHomePage
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showNavBar, openSideMenu, notHomePage, hideNavBar]);

  //Add listener for whenever the user clicks outside the drawer
  useEffect(() => {
    if (!openSideMenu) return;
    const onKey = (e) => e.key === "Escape" && setOpenSideMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openSideMenu]);

  // Locks the scrolling when drawer menu is open
  useEffect(() => {
    if (openSideMenu) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [openSideMenu]);

  function handleClickMainMenu() {
    setHideNavBar(true);
    setTimeout(() => {
      setHideNavBar(false);
    }, 1500);
  }

  function handleClickSideMenu() {
    setShowNavBar(false);
    setOpenSideMenu(!openSideMenu);
  }

  const links = [
    { label: "About Us", href: "about", dedicatedPage: false },
    { label: "Team", href: "team", dedicatedPage: true },
    { label: "What to Expect", href: "what-to-expect", dedicatedPage: true },
    { label: "Treatments", href: "treatments", dedicatedPage: true },
    { label: "FAQ", href: "faq", dedicatedPage: true },
    { label: "Contact", href: "contact", dedicatedPage: true },
  ];

  const navBarStyles = {
    notHomepage: {
      scrollYPosition: [0],
      bgColor: ["#fff"],
      boxShadow: ["0px 2px 10px rgba(0,0,0,0.1)"],
    },
    homepage: {
      scrollYPosition: [0, 100, 150],
      bgColor: ["transparent", "#ffffff10", "#ffffff"],
      boxShadow: [
        "0px 0px 0px rgba(0,0,0,0)",
        "0px 0px 0px rgba(0,0,0,0.03)",
        "0px 2px 10px rgba(0,0,0,0.1)",
      ],
    },
  };

  const backgroundColor = useTransform(
    scrollY,
    notHomePage
      ? navBarStyles.notHomepage.scrollYPosition
      : navBarStyles.homepage.scrollYPosition,
    notHomePage
      ? navBarStyles.notHomepage.bgColor
      : navBarStyles.homepage.bgColor
  );

  const boxShadow = useTransform(
    scrollY,
    notHomePage
      ? navBarStyles.notHomepage.scrollYPosition
      : navBarStyles.homepage.boxShadow,
    notHomePage
      ? navBarStyles.notHomepage.boxShadow
      : navBarStyles.homepage.boxShadow
  );

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={showNavBar ? { y: 0, opacity: 1 } : { y: -50, opacity: 0 }}
        style={{ backgroundColor, boxShadow }}
        className={
          notHomePage
            ? "bg-easyWhite sticky top-0 left-0 w-full z-50"
            : "fixed top-0 left-0 w-full z-50"
        }
      >
        <div className="text-gray-600 px-4 py-2 lg:px-8 flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center"
            aria-label="Go to homepage"
          >
            <Image src={horizontal_logo} alt="" width={120} />
          </Link>

          <div className="hidden lg:flex gap-6 items-center">
            {links.map((l) => (
              <NavHeaderButton asChild key={l.label}>
                <Link
                  href={`${notHomePage && l.dedicatedPage ? "/" : "/#"}${
                    l.href
                  }`}
                  onClick={() => handleClickMainMenu()}
                >
                  {l.label}
                </Link>
              </NavHeaderButton>
            ))}

            <Link href="/bookings">
              <Button buttonType="primary" className="ml-8">
                Book now
              </Button>
            </Link>
          </div>

          <button
            className="lg:hidden inline-flex items-center justify-center p-2 border border-primary/20 active:scale-95 "
            onClick={() => setOpenSideMenu(true)}
            aria-label="Open menu"
            aria-controls="mobile-drawer"
            aria-expanded={openSideMenu}
          >
            <Menu
              size={24}
              aria-hidden="true"
              focusable="false"
              className="text-primary"
            />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {openSideMenu && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 bg-easyDark/60 z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenSideMenu(false)}
            />

            <motion.aside
              id="mobile-drawer"
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white text-gray-600 z-[70] shadow-2xl flex flex-col"
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
                  className="p-2 border border-primary/20 text-primary rounded"
                  onClick={() => setOpenSideMenu(false)}
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
                        href={`${notHomePage && l.dedicatedPage ? "/" : "/#"}${
                          l.href
                        }`}
                        className="block px-3 py-1 uppercase"
                        onClick={() => handleClickSideMenu()}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-4">
                  <Link href="/bookings" onClick={() => setOpenSideMenu(false)}>
                    <Button
                      buttonType="primary"
                      className="w-full justify-center"
                    >
                      Book now
                    </Button>
                  </Link>
                </div>
              </nav>

              <div className="px-4 pb-5 text-xs text-gray-400 uppercase">
                © {new Date().getFullYear()} Aesthetics by Dr Hendler
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
