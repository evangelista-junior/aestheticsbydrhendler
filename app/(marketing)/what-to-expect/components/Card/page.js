export default function Card({ cardTitle, cardInfo }) {
  return (
    <div className="group shadow-inner px-6 py-12 md:p-6 md:aspect-square flex flex-col justify-center text-center">
      <p className="uppercase group-hover:font-semibold group-hover:tracking-wide duration-100">
        {cardTitle}
      </p>

      <div className="">
        <p className="font-extralight tracking-wider text-gray-500">
          {cardInfo}
        </p>
      </div>
    </div>
  );
}
