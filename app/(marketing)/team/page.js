import Image from "next/image";
import teamMemberPhoto from "@/public/images/teamMemberPhoto.jpeg";
import drShaySignature from "@/public/images/dr_shay_signature.png";
import Button from "@/components/Button";
import { CalendarDays } from "lucide-react";
import Link from "next/link";

export default function Team() {
  return (
    <section id="team" className="text-black lg:py-24 p-6">
      <div className="w-full xl:w-2/3 mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center bg-white p-6">
        <div className="relative w-full h-[500px] lg:h-[600px] shadow-2xl">
          <Image
            src={teamMemberPhoto}
            alt="Dr. Shane Hendler"
            className="object-cover h-full xl:grayscale-25 hover:grayscale-0 transition-all duration-300 relative z-10"
          />
        </div>

        <div className="flex flex-col justify-center gap-6">
          <div className="flex items-center gap-3">
            <div>
              <div>
                <p className="relative z-10 text-4xl lg:text-5xl font-title font-semi">
                  Dr Shay Hendler
                </p>
                <Image
                  src={drShaySignature}
                  alt="Dr Shay Hendler signature."
                  unoptimized={false}
                  className="object-cover absolute w-sm lg:w-fit -m-9 -ml-15 z-0 opacity-15"
                />
              </div>
              <p className="text-gray-600 mt-6 tracking-wide font-title relative z-10">
                MD, BA-Psych | AHPRA MED0002142210
              </p>
            </div>
          </div>

          <div className="text-gray-800 text-md leading-relaxed tracking-wide space-y-3">
            <p>
              Dr Hendler is a dedicated paediatric doctor with additional{" "}
              <strong>specialist training in medical aesthetics.</strong>
            </p>
            <p>
              Mentored by renowned dermatologist Dr Alice Rudd, she has combined
              her innate ability for facial assessment with finely honed skills
              in aesthetic treatments.
            </p>
            <p>
              Her approach is guided by a deep commitment to delivering subtle,
              natural results that enhance rather than alter, ensuring every
              patient feels confident in their own skin. She is equally devoted
              to patient-centred care, prioritising safety at every stage, and
              achieving results that are undetectable—leaving patients simply
              looking refreshed, healthy, and effortlessly themselves.
            </p>
          </div>

          <Link
            href="/bookings"
            className="mx-auto items-center md:mx-0 mt-3 lg:mt-0"
          >
            <Button buttonType="primaryRounded" className="w-auto">
              <CalendarDays size={20} aria-hidden="true" focusable="false" />
              Book a Consultation
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
