// app/booking/page.js  (SERVER)
import Booking from "./Booking";

export const metadata = {
  title: "Book a Consultation | Aesthetics by Dr Hendler", // não precisa ser object
  description:
    "Book your cosmetic injectables consultation with Dr. Shane Hendler in Bondi, Sydney. Safe, tailored anti-wrinkle and dermal filler treatments.",
  keywords: [
    "cosmetic injectables Sydney",
    "anti-wrinkle Bondi",
    "dermal fillers Sydney",
    "cosmetic doctor Eastern Suburbs",
    "aesthetic clinic Bondi",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.aestheticsbydrhendler.com.au/bookings",
  },
  openGraph: {
    title: "Book a Consultation | Aesthetics by Dr Hendler",
    description:
      "Arrange your consultation for cosmetic injectables in Bondi & Sydney’s Eastern Suburbs with Dr. Shane Hendler.",
    url: "https://www.aestheticsbydrhendler.com.au/bookings",
    siteName: "Aesthetics by Dr Hendler",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: "https://www.aestheticsbydrhendler.com.au/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aesthetics by Dr Hendler clinic in Bondi",
      },
    ],
  },
};

export default function Page() {
  return <Booking />;
}
