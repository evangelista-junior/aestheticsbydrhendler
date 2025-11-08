import Image from "next/image";
import aboutUsImage from "@/public/images/sand.png";

export default function AboutUs() {
  return (
    <section
      id="about"
      className="w-full flex items-center justify-center md:py-6 text-gray-600"
    >
      <Image
        src={aboutUsImage}
        alt="About us image (sand pattern)"
        unoptimized={false}
        className="object-cover relative md:w-3/5 opacity-30"
      />

      <div className="absolute w-full md:w-2/5 p-1 xl:p-12">
        <p className="text-md md:text-xl font-title uppercase">
          Enhancing natural beauty with ethical, safe, and effective aesthetic
          procedures.
        </p>

        <p className="text-xs md:text-sm leading-relaxed font-light tracking-wide mt-1">
          We specialise in treatments that are{" "}
          <span className="font-bold tracking-wider">
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
