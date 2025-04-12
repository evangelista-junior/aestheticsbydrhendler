export default function SecondaryButton({ children }) {
  return (
    <p className="relative inline-block group cursor-pointer hover:font-bold transition-all duration-300">
      <span className="after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-0 after:bg-[#FFC0CB] after:transition-all after:duration-300 group-hover:after:w-full">
        {children}
      </span>
    </p>
  );
}
