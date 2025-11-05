export default function NavHeaderButton({ children }) {
  return (
    <p className="relative inline-block group cursor-pointer transition-all duration-300 tracking-widest text-easyDark">
      <span
        className={`after:content-[''] after:absolute after:bottom-0 after:left-1/2 
          after:-translate-x-1/2 after:h-[2px] after:w-0 after:bg-primary-300 
          after:transition-all after:duration-300 group-hover:after:w-full`}
      >
        {children}
      </span>
    </p>
  );
}
