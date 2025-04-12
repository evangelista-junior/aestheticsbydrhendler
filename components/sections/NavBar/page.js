import Image from "next/image";
import aura from "@/public/images/aura medical.png";
import SecondaryButton from "@/components/primary/SecondaryButton/page";
import PrimaryButton from "@/components/primary/PrimaryButton/page";

export default function NavBar() {
  return (
    <section
      className="bg-white text-black p-2 pl-8 pr-8 grid grid-cols-2 
        items-center "
    >
      <Image src={aura} alt="" />

      <div className="flex space-x-16 items-center ">
        {/* TODO: Add scroll animation towards the topics */}
        <SecondaryButton>treatments</SecondaryButton>
        <SecondaryButton>before/after</SecondaryButton>
        <SecondaryButton>about us</SecondaryButton>
        <SecondaryButton>location</SecondaryButton>
        <SecondaryButton>contact</SecondaryButton>

        {/* TODO: Add link to the booking page */}
        <div className="flex justify-end ">
          <PrimaryButton primaryColor>Book now</PrimaryButton>
        </div>
      </div>
    </section>
  );
}
