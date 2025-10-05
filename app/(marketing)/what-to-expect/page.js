import Image from "next/image";
import benefitsImg from "@/public/images/benefits.png";
import {
  BookOpenCheck,
  NotebookPen,
  ScanFace,
  ShieldAlert,
  Sparkle,
  Stethoscope,
} from "lucide-react";
import Card from "./components/Card/page";

const BENEFITS = [
  {
    icon: Stethoscope,
    title: "Medical Expertise & Safety",
    info: "Treatments performed with a comprehensive understanding of facial anatomy, always putting your safety at the forefront.",
  },
  {
    icon: ScanFace,
    title: "Advanced Diagnostic Assessment",
    info: "A comprehensive facial evaluation that prioritizes facial harmony while honoring your unique features.",
  },
  {
    icon: ShieldAlert,
    title: "Complication Management",
    info: "Peace of mind knowing any rare complications that may arise during treatment can be immediately addressed by a doctor.",
  },
  {
    icon: Sparkle,
    title: "Natural Results",
    info: "Achieve subtle enhancements that respect your facial dynamics and natural expressions. A ‘fresh not frozen’ approach.",
  },
  {
    icon: NotebookPen,
    title: "Personalised Treatment Plans",
    info: "Receive a comprehensive treatment strategy based on medical principles, not just aesthetic trends.",
  },
  {
    icon: BookOpenCheck,
    title: "Patient Education & Empowerment",
    info: "We guide you through every step of your treatment journey, ensuring you understand your options and feel confident in every decision.",
  },
];

export default function WhatToExpect() {
  return (
    <section
      id="what-to-expect"
      className="w-full p-12 grid gap-6 2xl:grid-cols-[auto_1fr] justify-center items-center group"
    >
      <div className="w-full 2xl:w-[90%] flex justify-center overflow-hidden">
        <Image
          src={benefitsImg}
          alt="Benefits"
          className="2xl:w-full max-h-[650px] object-cover shadow-2xl scale-110 group-hover:scale-100 duration-500"
        />
      </div>

      <div className="w-full 2xl:w-full">
        <ul className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6">
          {BENEFITS.map(({ icon: Icon, title, info }) => (
            <li key={title}>
              <Card
                cardIcon={
                  <Icon
                    aria-hidden="true"
                    focusable="false"
                    className="h-6 w-6"
                  />
                }
                cardTitle={title}
                cardInfo={info}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
