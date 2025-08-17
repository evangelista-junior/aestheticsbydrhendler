import microneedling from "@/public/images/microneedling.png";
import rejuran from "@/public/images/rejuran.png";
import antiwrinkle from "@/public/images/antiwrinkle.png";
import Card from "./components/Card/page";

export default function Treatments() {
  return (
    <section
      id="treatments"
      className="p-8 xl:p-24 bg-white text-gray-600 flex justify-center 
     drop-shadow-[0_0px_10px_rgba(0,0,0,0.1)]"
    >
      <div className="w-full xl:max-w-2/3 flex flex-col gap-6 xl:gap-12 ">
        <Card
          cardImage={antiwrinkle}
          cardTitle="Wrinkle Treatments"
          cardInfo="Wrinkle reduction treatments aim to soften the appearance of fine
            lines and wrinkles by relaxing targeted muscles, which can help
            create a smoother, more refreshed look. With specific techniques,
            you can maintain facial expression whilst also working subtly to
            reduce visible signs of ageing. During your personalised
            consultation, we will assess your facial features and discuss how
            these treatments might help you achieve your aesthetic goals
            safely and comfortably."
          learnMore
        />

        <Card
          comingsoon
          cardImage={rejuran}
          cardTitle="Skin Rejuvenation with Rejuran"
          cardInfo="Rejuran treatments focus on supporting skin health and improving
            texture through the use of specialised polynucleotide complexes.
            These treatments aim to enhance skin quality and promote a more
            youthful, refreshed appearance. We customise your treatment based
            on your skin’s needs, and will discuss the expected process,
            potential benefits, and possible side effects during your
            consultation."
        />

        <Card
          comingsoon
          cardImage={microneedling}
          cardTitle="Microneedling with Exosomes"
          cardInfo="Microneedling combined with exosome therapy is a minimally
              invasive procedure designed to support skin regeneration and
              improve overall skin texture and tone. The treatment involves
              creating controlled micro-injuries to stimulate the skin’s natural
              repair processes, enhanced by the application of exosomes to aid
              cellular communication and healing. Your personalised plan will be
              developed after a thorough assessment, with clear information
              provided about the treatment process, potential outcomes, and any
              risks."
        />
      </div>
    </section>
  );
}
