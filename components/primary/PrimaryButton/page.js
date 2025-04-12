export default function PrimaryButton({
  children,
  primaryColor = false,
  bold = false,
}) {
  const paddingClass = bold
    ? "p-4 pb-3 shadow-[0_4px_4px_rgba(0,0,0,0.25)] border-b-4" // pb-3 (3 rem = 12 px) fixes the "bigger" padding caused by the border-b-4 (4px)
    : "p-2 px-4";

  const buttonClasses =
    (primaryColor === true
      ? "bg-[#FFC0CB] text-white"
      : "bg-white text-black border-white hover:border-red-300") +
    ` ${paddingClass}`;

  return (
    <button
      className={`
        font-bold rounded-md
        cursor-pointer
        hover:scale-105 transition-all duration-300
        ${buttonClasses}
      `}
    >
      {children}
    </button>
  );
}
