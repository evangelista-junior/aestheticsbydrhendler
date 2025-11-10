import "./globals.css";
import NavBar from "@/features/NavBar";
import Footer from "@/features/Footer";
import LoadingModal from "@/components/LoadingModal";
import FeedbackModal from "@/components/FeedbackModal";

export const metadata = {
  title:
    "Cosmetic Injectables Bondi & Eastern Suburbs | Natural & Subtle Results",
  description:
    "Trusted cosmetic injectables clinic in Bondi, Coogee, and Eastern Suburbs of Sydney. Delivering natural, subtle results with a focus on safety and patient care.",
  alternates: {
    canonical: "https://www.aestheticsbydrhendler.com.au",
  },
  openGraph: {
    title: "Cosmetic Injectables in Bondi & Eastern Suburbs",
    description:
      "Subtle, natural enhancements with a focus on safety and patient care. Serving Bondi, Coogee, Double Bay, and surrounding Eastern Suburbs.",
    url: "https://www.aestheticsbydrhendler.com.au",
    siteName: "Aesthetics by Dr. Hendler",
    images: [
      {
        url: "https://www.aestheticsbydrhendler.com.au/images/minimalist_logo.png",
        width: 1200,
        height: 630,
        alt: "Cosmetic injectables Bondi",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Natural Cosmetic Injectables in Bondi & Eastern Suburbs",
    description:
      "Subtle, natural enhancements with a focus on safety and patient care.",
    images: [
      "https://www.aestheticsbydrhendler.com.au/images/website-hero.png",
    ],
  },
  icons: {
    icon: [
      { url: "/images/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/images/favicon.svg", type: "image/svg+xml" },
      { url: "/images/favicon.ico" },
    ],
    shortcut: "/images/favicon.ico",
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  manifest: "/site.webmanifest",
};
export const viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full font-body">
      <body className="grid h-screen grid-rows-[auto_1fr_auto] antialiased">
        <LoadingModal />
        <FeedbackModal />

        <NavBar />
        <main className="flex justify-center items-center text-gray-700 z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
