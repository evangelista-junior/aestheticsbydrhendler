"use client";

import { usePathname } from "next/navigation";
import Card from "./components/Card/page";
import { useEffect, useState } from "react";
import Headings from "@/components/primary/Headings";
import Image from "next/image";
import neutralBackgorund from "@/public/images/neutral-background.png";

export default function Treatments() {
  const [treatments, setTreatments] = useState([]);
  const urlPath = usePathname();

  const isDedicatedPath = urlPath == "/treatments" && true;

  useEffect(() => {
    async function fetchTreatments() {
      try {
        const res = await fetch("/api/v1/treatments");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setTreatments(data.treatments);
      } catch (err) {
        console.error("Failed to fetch treatments:", err);
        // TODO: setError(err.message) if you track error state
      }
    }

    fetchTreatments();
  }, []);
  return (
    <section
      id="treatments"
      className="w-full p-6 xl:p-24 bg-white text-gray-600 flex flex-col items-center justify-center gap-9 drop-shadow-[0_0px_10px_rgba(0,0,0,0.1)]"
    >
      <div className="absolute inset-0">
        <Image
          src={neutralBackgorund}
          alt=""
          fill
          className="object-cove opacity-5"
        />
      </div>
      {isDedicatedPath && (
        <Headings headingType="h1" className="font-light tracking-widest">
          Available treatments
        </Headings>
      )}

      <div className="px-12 py-6 relative backdrop-blur-xl w-full grid 2xl:grid-cols-2 gap-6 xl:gap-12">
        {!!treatments &&
          treatments.map((treatment) => {
            return (
              <Card
                key={treatment.id}
                treatmentId={treatment.id}
                treatmentImage={treatment.imageUrl}
                treatmentName={treatment.name}
                treatmentInfo={treatment.description}
                treatmentAvailability={treatment.availability}
                treatmentHasBlogContent={treatment.hasBlogContent}
              />
            );
          })}
      </div>
    </section>
  );
}
