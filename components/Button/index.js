export default function Button({
  children,
  type,
  disabled,
  buttonType = "primary",
  className = "",
  onClick,
}) {
  const baseStyles =
    "flex justify-center items-center gap-2 cursor-pointer transition-all duration-300 uppercase tracking-wider shadow-xl p-2 px-4";

  const variants = {
    primary: "bg-primary text-white text-shadow-md hover:scale-105",

    dark: "bg-easyDark text-white border-1 border-easyDark rounded-sm hover:bg-gray-100 hover:text-gray-600 hover:border-gray-400 hover:rounded-md",

    darkInverse:
      "bg-transparent text-gray-600 border-1 border-gray-400 rounded-md hover:bg-easyDark hover:text-white hover:border-easyDark hover:rounded-sm",

    primaryRounded:
      "rounded-md border-1 border-primary bg-primary text-white hover:bg-transparent hover:text-primary",

    outline:
      "rounded-md border-1 border-primary bg-transparent text-primary hover:bg-primary hover:text-white",

    outlineInverse:
      "rounded-md border-1 border-white bg-transparent text-white hover:bg-primary",

    confirm:
      "rounded-md border-1 border-green-400 bg-green-400 text-white hover:bg-green-600",

    decline:
      "rounded-md border-1 border-red-400 bg-red-400 text-white hover:bg-red-600",

    confirmInverse:
      "rounded-md border-1 border-white bg-transparent text-white hover:bg-green-500 hover:border-green-200 hover:text-green-200",

    declineInverse:
      "rounded-md border-1 border-white bg-transparent text-white hover:bg-red-500 hover:border-red-200 hover:text-red-200",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[buttonType]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
