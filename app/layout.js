import { Roboto } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/sections/NavBar";
import Footer from "@/components/sections/Footer";

const robotoFont = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata = {
  title:
    "Cosmetic Injectables Bondi & Eastern Suburbs | Natural & Subtle Results",
  description:
    "Trusted cosmetic injectables clinic in Bondi, Coogee, and Eastern Suburbs of Sydney. Delivering natural, subtle results with a focus on safety and patient care.",
  keywords: [
    "cosmetic injectables Bondi",
    "cosmetic injectables Coogee",
    "cosmetic injectables Double Bay",
    "cosmetic injectables Eastern Suburbs",
    "anti-wrinkle injections Bondi",
    "dermal fillers Bondi",
    "lip fillers Bondi",
    "natural cosmetic enhancements Sydney",
    "Bondi Beach injectables",
    "aesthetic clinic Bondi",
  ],
  openGraph: {
    title: "Natural Cosmetic Injectables in Bondi & Eastern Suburbs",
    description:
      "Subtle, natural enhancements with a focus on safety and patient care. Serving Bondi, Coogee, Double Bay, and surrounding Eastern Suburbs.",
    url: "https://aestheticsbydrhendler.com.au",
    siteName: "Aesthetics by Dr. Hendler",
    images: [
      {
        url: "https://aestheticsbydrhendler.com.au/imagens/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Cosmetic injectables Bondi",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  alternates: {
    canonical: "https://aestheticsbydrhendler.com.au",
  },
  other: {
    "geo.position": "-33.8915;151.2767",
    "geo.placename": "Bondi, Eastern Suburbs, Sydney",
    "geo.region": "AU-NSW",
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="grid h-screen grid-rows-[auto_1fr_auto] antialiased">
        <NavBar />
        <main className="bg-gray-100">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
