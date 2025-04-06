import Image from "next/image";
import HeaderBackground from "@/public/images/home-background.jpg";
import Button from "../../primary/Button/page";

export default function Header() {
  return (
    <section className="w-full h-4/5 relative">
      {/* TODO: Apagar a div abaixo quando scroll down */}
      <div className="bg-black/90 cursor-pointer underline tracking-wider w-full p-4 text-center absolute z-30 hover:bg-black/95 transition duration-200">
        <p>Book your assesment here !!!</p>
      </div>

      <div className="absolute inset-0">
        <Image src={HeaderBackground} alt="" fill className="object-cover" />
        {/* Overlay escura por cima da imagem */}
        <div className="absolute inset-0 bg-gradient-to-b from-0 to-black/40 z-10" />
      </div>

      <div className="relative z-20 h-full w-full grid grid-cols-2 items-end p-16 pb-40 text-white">
        <h1 className="text-6xl ">
          Enhance Your Natural Beauty with Confidence
        </h1>

        <div className="">
          <p className="text-xl tracking-wide mb-6 ">
            Rediscover your confidence with our tailored, subtle procedures
            designed to enhance your natural beauty. We celebrate your
            individuality while gently softening the signs of aging,
            prioritizing your safety, comfort, and well-being.
          </p>
          <Button>Book Your Consultation</Button>
        </div>
      </div>
    </section>
  );
}
