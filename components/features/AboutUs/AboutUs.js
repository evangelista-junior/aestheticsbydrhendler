import Headings from "@/components/ui/Headings";
import Image from "next/image";
import aboutUsImage from "@/public/images/aboutus.png";

export default function AboutUs() {
  return (
    <section
      id="about"
      className="relative w-full flex items-center justify-center py-10 text-center text-gray-700"
    >
      <Image src={aboutUsImage} alt="" className="absolute w-full h-full" />
      <div
        className="relative w-4/5 xl:w-3/5 p-6 xl:p-12 bg-transparent dark:bg-[rgba(0,0,0,)] 
        backdrop-blur-xl backdrop-saturate-200 "
      >
        <Headings headingType="h2" className="text-xl xl:text-5xl">
          Enhancing natural beauty with ethical, safe, and effective aesthetic
          procedures.
        </Headings>

        <p className="text-base xl:text-lg leading-relaxed font-light tracking-wide mt-4 light:text-neutral-700">
          We specialise in treatments that are{" "}
          <span className="font-bold tracking-widest">
            effective yet undetectable
          </span>
          . Our mission is to celebrate what makes you uniquely you, using
          gentle, evidence-based approaches that leave you feeling confident and
          refreshed. By combining advanced techniques with precise medical
          expertise, we create results that are subtle, refined, and tailored to
          your individual goals. Safety, comfort, and satisfaction are at the
          heart of everything we do, with every procedure performed to the
          highest standard of care.
        </p>
      </div>
    </section>
  );
}
