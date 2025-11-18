import Card from "./components/Card";
import Headings from "@/components/Headings";

const benefits = [
  {
    title: "Medical Expertise & Safety",
    info: "Treatments performed with a comprehensive understanding of facial anatomy, always putting your safety at the forefront.",
  },
  {
    title: "Advanced Diagnostic Assessment",
    info: "A comprehensive facial evaluation that prioritizes facial harmony while honoring your unique features.",
  },
  {
    title: "Complication Management",
    info: "Peace of mind knowing any rare complications that may arise during treatment can be immediately addressed by a doctor.",
  },
  {
    title: "Natural Results",
    info: "Achieve subtle enhancements that respect your facial dynamics and natural expressions. A 'fresh not frozen' approach.",
  },
  {
    title: "Personalised Treatment Plans",
    info: "Receive a comprehensive treatment strategy based on medical principles, not just aesthetic trends.",
  },
  {
    title: "Patient Education & Empowerment",
    info: "We guide you through every step of your treatment journey, ensuring you understand your options and feel confident in every decision.",
  },
];

export default function WhatToExpect() {
  return (
    <section id="what-to-expect" className="w-4/5 relative mx-auto my-12">
      <Headings
        headingType="h2"
        className="tracking-wider uppercase font-light mb-6 text-center"
      >
        Why Choose Us
      </Headings>
      <div className="mt-12 h-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-3">
        {benefits.map(({ title, info }) => (
          <Card key={title} cardTitle={title} cardInfo={info} />
        ))}
      </div>
    </section>
  );
}
