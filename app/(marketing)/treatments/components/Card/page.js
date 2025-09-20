import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Card({
  treatmentId,
  treatmentImage,
  treatmentName,
  treatmentInfo,
  treatmentAvailability,
  treatmentHasBlogContent,
}) {
  return (
    <article className="md:flex md:items-center gap-8">
      <div className="w-full md:w-[200px] md:h-[200px] md:flex-shrink-0 overflow-hidden rounded-lg aspect-square">
        {treatmentAvailability == "SOON" && (
          <p className="xl:hidden text-center relative bg-primary-100 text-primary-900 text-xs font-semibold px-2 py-0.5 rounded-tl-lg rounded-tr-lg top-2">
            COMING SOON
          </p>
        )}
        <Image
          src={treatmentImage}
          alt=""
          width={200}
          height={200}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-4 flex text-start xl:items-center gap-3 flex-col xl:flex-row">
          {treatmentName}
          {treatmentAvailability == "SOON" && (
            <p className="hidden xl:inline-block bg-primary-100 text-primary-900 text-xs font-semibold px-2 py-0.5 rounded relative xl:static -top-20">
              COMING SOON
            </p>
          )}
        </h3>
        <p className="mb-4 leading-relaxed">{treatmentInfo}</p>
        {treatmentHasBlogContent && (
          <Link href={`/treatments/${treatmentId}`}>
            <button
              className="cursor-pointer bg-primary-300 flex gap-2 justify-center items-center pl-4 pr-1 py-2 text-white rounded-full w-full xl:w-auto
                        hover:3 transition-all duration-300
                      "
            >
              LEARN MORE
              <ArrowRight
                size={20}
                aria-hidden="true"
                focusable="false"
                className="bg-white text-primary-300 rounded-full"
              />
            </button>
          </Link>
        )}
      </div>
    </article>
  );
}
