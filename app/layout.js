import "./globals.css";
import NavBar from "@/features/NavBar";
import Footer from "@/features/Footer";
import neutralBackgorund from "@/public/images/neutral-background.png";
import Image from "next/image";
import LoadingModal from "@/components/LoadingModal";
import FeedbackModal from "@/components/FeedbackModal";

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
    <html lang="en" className="h-full font-body">
      <body className="grid h-screen grid-rows-[auto_1fr_auto] antialiased">
        <LoadingModal />
        <FeedbackModal />

        <NavBar />
        <div className="absolute inset-0 -z-10">
          <Image
            src={neutralBackgorund}
            alt=""
            aria-hidden
            fill
            className="object-cover opacity-5"
            priority={false}
          />
        </div>
        <main className="flex justify-center items-center text-gray-700 z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
