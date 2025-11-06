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
    <article className="mt-6 px-3">
      <p className="px-3 text-2xl uppercase">{treatmentName}</p>

      <div className="w-full md:flex px-3">
        <div className="md:w-4/5">
          <h3 className="text-md tracking-wider font-bold mb-1 flex text-start xl:items-center gap-3 flex-col xl:flex-row">
            {treatmentAvailability == "SOON" && (
              <p className="hidden xl:inline-block bg-primary text-white text-xs font-semibold px-2 py-0.5 relative xl:static -top-20">
                COMING SOON
              </p>
            )}
          </h3>
          <p className="mb-3 leading-relaxed text-sm w-full">{treatmentInfo}</p>
          {treatmentHasBlogContent && (
            <Link href={`/treatments/${treatmentId}`}>
              <button
                className="cursor-pointer bg-primary flex gap-2 justify-center items-center pl-4 pr-1 py-2 text-xs text-white w-full xl:w-auto
                        hover:gap-3 transition-all duration-300
                      "
              >
                LEARN MORE
                <ArrowRight
                  size={20}
                  aria-hidden="true"
                  focusable="false"
                  className="bg-white text-primary rounded"
                />
              </button>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
