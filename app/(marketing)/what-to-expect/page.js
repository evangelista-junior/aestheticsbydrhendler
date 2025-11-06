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
    info: "Achieve subtle enhancements that respect your facial dynamics and natural expressions. A 'fresh not frozen' approach.",
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
    <section id="what-to-expect" className="w-4/5 relative mx-auto">
      <div className="mt-12 h-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-3">
        {BENEFITS.map(({ icon: Icon, title, info, gridClasses }) => (
          <Card key={title} cardTitle={title} cardInfo={info} />
        ))}
        {/* <div className="col-span-2 row-span-2 bg-red-200">1</div>
        <div className="col-span-2 row-span-3 col-start-1 row-start-3 bg-red-200 shadow">
          2
        </div>
        <div className="row-span-3 col-start-3 row-start-1 bg-red-200 shadow">
          3
        </div>
        <div className="col-span-2 row-span-3 col-start-4 row-start-1 bg-red-200 shadow">
          4
        </div>
        <div className="col-span-2 row-span-2 col-start-3 row-start-4 bg-red-200 shadow">
          5
        </div>
        <div className="row-span-2 col-start-5 row-start-4 bg-red-200 shadow">
          6
        </div> */}
      </div>
    </section>
  );
}
