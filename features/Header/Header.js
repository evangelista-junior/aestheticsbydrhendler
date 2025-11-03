"use client";
import Image from "next/image";
import HeaderBackground from "@/public/images/sand.png";
import { CalendarDays } from "lucide-react";
import Button from "@/components/Button";
import transparentLogo from "@/public/images/logo_horizontal_blackandwhite.png";
import Link from "next/link";

export default function Header() {
  return (
    <section className="w-full h-dvh relative">
      <div className="absolute inset-0">
        <Image
          src={HeaderBackground}
          alt=""
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-[radial-gradient(30%_50%_at_50%_50%,rgba(255,255,255,0),rgba(255,255,255,0.3)_62%)] " />
      </div>

      <div className="relative z-20 h-full w-full p-4 md:p-16 pb-8 md:pb-20 text-gray-500 flex flex-col justify-end">
        <div className="relative flex flex-col justify-center items-center gap-2 md:gap-1">
          <Image
            src={transparentLogo}
            className="w-full max-w-[350px]"
            alt=""
          />
          <p className="w-full text-center tracking-widest text-md md:text-2xl font-extralight text-nowrap overflow-hidden">
            Where medical expertise meets natural aesthetics
          </p>

          <Link href="/bookings">
            <Button className="mt-16 md:mt-30 " buttonType="outline">
              <CalendarDays size={18} aria-hidden="true" focusable="false" />
              Book Your Consultation
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
