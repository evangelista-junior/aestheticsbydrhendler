import Image from "next/image";
import benefitsImg from "@/public/images/benefits.png";
import {
  Activity,
  Clipboard,
  FileText,
  Heart,
  Shield,
  Smile,
} from "lucide-react";
import Card from "./components/Card/page";

const BENEFITS = [
  {
    icon: Shield,
    title: "Medical Expertise & Safety",
    info: "Treatments performed with a comprehensive understanding of facial anatomy, always putting your safety at the forefront.",
  },
  {
    icon: Clipboard,
    title: "Advanced Diagnostic Assessment",
    info: "A comprehensive facial evaluation that prioritizes facial harmony while honoring your unique features.",
  },
  {
    icon: Activity,
    title: "Complication Management",
    info: "Peace of mind knowing any rare complications that may arise during treatment can be immediately addressed by a doctor.",
  },
  {
    icon: Smile,
    title: "Natural-Looking Results",
    info: "Achieve subtle enhancements that respect your facial dynamics and natural expressions. A ‘fresh not frozen’ approach.",
  },
  {
    icon: FileText,
    title: "Personalised Treatment Plans",
    info: "Receive a comprehensive treatment strategy based on medical principles, not just aesthetic trends.",
  },
  {
    icon: Heart,
    title: "Patient Education & Empowerment",
    info: "We guide you through every step of your treatment journey, ensuring you understand your options and feel confident in every decision.",
  },
];

export default function WhatToExpect() {
  return (
    <section
      id="expect"
      className="bg-easyWhite text-gray-800 px-4 py-12 lg:px-8 flex flex-col items-center 2xl:flex-row gap-8"
    >
      <div className="w-full flex justify-center">
        <Image
          src={benefitsImg}
          alt="Benefits preview"
          className="rounded-lg xl:w-2/3 max-h-[650px] object-cover shadow-2xl 
            "
          priority
        />
      </div>

      <div className="2xl:relative xl:-left-10 w-full p-4 justify-center xl:justify-start">
        <ul className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6">
          {BENEFITS.map(({ icon: Icon, title, info }) => (
            <li key={title}>
              <Card
                cardIcon={
                  <Icon
                    size={24}
                    aria-hidden="true"
                    focusable="false"
                    className="p-0.5"
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
