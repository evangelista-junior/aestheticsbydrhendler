import Headings from "@/components/Headings";
import Image from "next/image";
import aboutUsImage from "@/public/images/aboutus.png";

export default function AboutUs() {
  return (
    <section
      id="about"
      className="w-full flex items-center justify-center py-6 text-gray-600"
    >
      <Image
        src={aboutUsImage}
        alt="About Us"
        className="object-cover relative w-3/5 "
      />

      <div className="absolute backdrop-saturate-50 w-4/5 xl:w-2/5 p-6 xl:p-12">
        <p className="text-xl lg:text-xl font-title uppercase">
          Enhancing natural beauty with ethical, safe, and effective aesthetic
          procedures.
        </p>

        <p className="text-sm leading-relaxed font-light tracking-wide mt-1">
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
