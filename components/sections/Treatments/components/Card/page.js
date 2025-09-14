import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Card({
  cardImage,
  cardTitle,
  cardInfo,
  comingsoon = false,
  learnMore = false,
}) {
  return (
    <article className="xl:flex gap-6">
      <div className="w-full xl:w-[200px] h-[200px] xl:flex-shrink-0 overflow-hidden rounded-lg">
        {comingsoon && (
          <p className="xl:hidden text-center relative bg-primary-100 text-primary-900 text-xs font-semibold px-2 py-0.5 rounded-tl-lg rounded-tr-lg top-2">
            COMING SOON
          </p>
        )}
        <Image src={cardImage} alt="" className="w-full h-full object-cover" />
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-4 flex text-center items-center gap-3 flex-col xl:flex-row">
          {cardTitle}
          {comingsoon && (
            <p className="hidden xl:inline-block bg-primary-100 text-primary-900 text-xs font-semibold px-2 py-0.5 rounded relative xl:static -top-20">
              COMING SOON
            </p>
          )}
        </h3>
        <p className="mb-4 leading-relaxed">{cardInfo}</p>
        {learnMore && (
          <button
            className="cursor-pointer bg-primary-300 flex gap-2 justify-center items-center pl-4 pr-1 py-2 text-white uppercase rounded-full w-full xl:w-auto
                        hover:3 transition-all duration-300
                      "
          >
            learn more
            <ArrowRight
              size={20}
              aria-hidden="true"
              focusable="false"
              className="bg-white text-primary-300 rounded-full"
            />
          </button>
        )}
      </div>
    </article>
  );
}
