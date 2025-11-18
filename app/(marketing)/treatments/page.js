"use client";

import { usePathname } from "next/navigation";
import Card from "./components/Card";
import halfFace from "@/public/images/half_face.png";
import { useEffect, useState } from "react";
import { useLoadingModal } from "@/store/useLoadingModal";
import Image from "next/image";
import Headings from "@/components/Headings";
import { apiRequest } from "@/lib/server/useApi";

export default function Treatments() {
  const [treatments, setTreatments] = useState([]);
  const urlPath = usePathname();
  const { setLoading, isLoading } = useLoadingModal();

  const isDedicatedPath = urlPath == "/treatments" && true;

  useEffect(() => {
    async function fetchTreatments() {
      try {
        if (isDedicatedPath) setLoading(true);
        const res = await apiRequest("/api/v1/treatments");
        if (res.ok == "false") throw new Error(res.message);

        setTreatments(res.treatments);
      } catch (err) {
        console.error("Failed to fetch treatments:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTreatments();
  }, [setLoading, isDedicatedPath]);

  if (!isLoading) {
    return (
      <section id="treatments" className="p-6 xl:px-0 xl:w-2/3 mx-auto">
        <Headings
          headingType="h2"
          className="tracking-wider uppercase font-light mb-12 text-center"
        >
          Our Treatments
        </Headings>

        <div className="flex flex-col-reverse md:flex-row">
          <div className="w-full">
            {treatments.map((t) => {
              return (
                <Card
                  key={t.id}
                  treatmentId={t.id}
                  treatmentImage={t.imageUrl}
                  treatmentName={t.name}
                  treatmentInfo={t.description}
                  treatmentAvailability={t.availability}
                  treatmentHasBlogContent={t.hasBlogContent}
                />
              );
            })}
          </div>
          <div className="bg-primary pt-12">
            <Image
              src={halfFace}
              alt="Half face image."
              className="object-cover rounded-t-full grayscale h-full"
            />
          </div>
        </div>
      </section>
    );
  }
}
