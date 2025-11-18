"use client";
import Image from "next/image";
import eyeAndCream from "@/public/images/eye_and_cream.png";
import { CalendarDays } from "lucide-react";
import Button from "@/components/Button";
import transparentLogo from "@/public/images/horizontal_logo_transparentbg.png";
import Link from "next/link";

export default function Header() {
  return (
    <section className="w-full h-dvh flex justify-center items-center">
      <Image
        src={eyeAndCream}
        alt="Moistureiser being applied around the eye area"
        className="absolute object-cover w-4/5 md:w-125 grayscale"
      />

      <div className="relative z-20 h-full w-full md:p-16 pb-8 md:pb-20 text-gray-500 flex flex-col justify-center">
        <div className="relative flex flex-col justify-center items-center gap-2 md:gap-1">
          <Image
            src={transparentLogo}
            className="relative w-1/2 max-w-[450px] mt-15"
            alt=""
          />

          <p className="w-full text-center text-md md:text-4xl font-title text-easyDark uppercase md:mt-6">
            Where medical expertise meets natural aesthetics
          </p>

          <div className="flex flex-col items-center sm:flex-row gap-3 mt-3">
            <Link href="/bookings">
              <Button className="" buttonType="primaryRounded">
                <CalendarDays size={18} aria-hidden="true" focusable="false" />
                Book Your Consultation
              </Button>
            </Link>
            <Link href="#treatments">
              <Button buttonType="dark">
                <CalendarDays size={18} aria-hidden="true" focusable="false" />
                View Treatments
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
