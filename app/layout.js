import "./globals.css";
import NavBar from "@/features/NavBar";
import Footer from "@/features/Footer";
import LoadingModal from "@/components/LoadingModal";
import FeedbackModal from "@/components/FeedbackModal";
// import { Bodoni_Moda, Nanum_Myeongjo } from "next/font/google"; //TODO:
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

export const metadata = {
  title:
    "Aesthetics by Dr Hendler - Sydney | Premium Cosmetic Injections & Skin Clinic",
  description:
    "Trust Dr. Hendler for safe, medically led non-surgical aesthetic treatments in Sydney. Specialising in natural-looking dermal fillers and anti-wrinkle injections.",
  keywords: [
    "Cosmetic Doctor Sydney",
    "Dermal Fillers Sydney",
    "Anti-wrinkle injections Melbourne",
    "Non-surgical facelift AU",
    "Lip fillers near me",
    "Best aesthetic clinic Australia",
    "Medical grade skincare",
    "Facial balancing specialist",
    "Dr. Hendler cosmetic",
    "Premium injectables Sydney",
  ],
  alternates: {
    canonical: "https://www.aestheticsbydrhendler.com.au",
  },
  openGraph: {
    title: "Aesthetics by Dr. Hendler: Achieve Your Natural and Refined Look",
    description:
      "Medically-led aesthetic care providing bespoke anti-wrinkle, filler, and skin treatments. Trust the expertise of Dr. Hendler for sophisticated, natural results.",
    type: "website",
    url: "https://www.aestheticsbydrhendler.com.au",
    siteName: "Aesthetics by Dr. Hendler",
    images: [
      {
        url: "https://www.aestheticsbydrhendler.com.au/images/website-hero.png",
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
    title: "Aesthetics by Dr. Hendler: Achieve Your Natural and Refined Look",
    description:
      "Medically-led aesthetic care providing bespoke anti-wrinkle, filler, and skin treatments. Trust the expertise of Dr. Hendler for sophisticated, natural results.",
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
};

export const viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full font-body">
      <head>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-1D0FCDLB4Y"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1D0FCDLB4Y');
          `}
        </Script>
      </head>
      <body className="grid h-screen grid-rows-[auto_1fr_auto] antialiased">
        <Analytics />
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
