"use client";

import { usePathname } from "next/navigation";
import Card from "./components/Card/page";
import { useEffect, useState } from "react";
import Headings from "@/components/primary/Headings";

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
      className="flex flex-col items-center justify-center gap-9 relative p-6 2xl:px-24 bg-transparent backdrop-blur-2xl  drop-shadow-[0_0px_10px_rgba(0,0,0,0.1)]"
    >
      {isDedicatedPath && ( //TODO: loading
        <Headings headingType="h1" className="font-light tracking-widest">
          Available treatments
        </Headings>
      )}

      <div className="px-12 py-6 w-full grid 2xl:grid-cols-2 gap-3 xl:gap-12">
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
