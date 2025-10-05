"use client";
import Image from "next/image";
import HeaderBackground from "@/public/images/header_bg.png";
import { CalendarDays } from "lucide-react";
import Button from "@/components/Button";
import transparentLogo from "@/public/images/horizontal_logo_transparentbg.png";
import Link from "next/link";

export default function Header() {
  return (
    <section className="w-full relative">
      <div className="absolute inset-0">
        <Image src={HeaderBackground} alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/75 z-10" />
      </div>

      <div className="relative z-20 h-full w-full p-4 md:p-16 pb-8 md:pb-20 text-white flex flex-col justify-end">
        <div className="relative flex flex-col justify-center items-center gap-2 md:gap-1">
          <Image
            src={transparentLogo}
            className="w-full max-w-[600px]"
            alt=""
          />
          <p className="w-[43ch] tracking-widest text-md md:text-2xl font-extralight text-nowrap overflow-hidden typing">
            Where medical expertise meets natural aesthetics
          </p>

          <Link href="/bookings">
            <Button className="mt-16 md:mt-30 " buttonType="outlineInverse">
              <CalendarDays size={18} aria-hidden="true" focusable="false" />
              Book Your Consultation
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
