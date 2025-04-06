import Image from "next/image";
import logo from "@/public/images/logo.png";
import nuva from "@/public/images/nuva medical.png";

export default function NavBar() {
  return (
    <section className="text-black p-4 pl-8 pr-8 grid grid-cols-2">
      <Image src={nuva} className="" />

      <div className="grid grid-cols-4">
        <p>treatments</p>
        <p>before/after</p>
        <p>about us</p>
        <p>contact</p>
      </div>
    </section>
  );
}
