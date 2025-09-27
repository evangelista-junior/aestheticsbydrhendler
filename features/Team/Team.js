import Image from "next/image";
import teamMemberPhoto from "@/public/images/teamMemberPhoto.jpeg";
import Headings from "@/components/ui/Headings";
import Button from "@/components/ui/Button";
import { CalendarDays } from "lucide-react";
import Link from "next/link";

export default function Team() {
  return (
    <section id="team" className="bg-easyWhite text-black lg:py-24 p-6">
      <div className="w-full xl:w-2/3 mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div className="relative w-full h-[500px] lg:h-[600px] overflow-hidden shadow-2xl">
          <Image
            src={teamMemberPhoto}
            alt="Dr. Shane Hendler"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center gap-8">
          <div className="flex items-center gap-3">
            <div>
              <Headings headingType="h2">Dr Shay Hendler</Headings>
              <p className="text-gray-600 mt-2 tracking-wide">
                MD, BA-Psych | AHPRA MED0002142210
              </p>
            </div>
          </div>

          <div className="text-gray-800 text-lg leading-relaxed space-y-4">
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
            className="mx-auto items-center lg:items-start lg:mx-0"
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
