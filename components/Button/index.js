export default function Button({
  children,
  type,
  disabled,
  buttonType = "primary",
  className = "",
  onClick,
}) {
  const baseStyles =
    "flex justify-center items-center gap-2 cursor-pointer transition-all duration-300 uppercase tracking-wider shadow-2xl p-2 px-4";

  const variants = {
    primary: "bg-primary-300 text-white text-shadow-md hover:scale-105",

    dark: "bg-easyDark text-white p-4 border-2 border-easyDark rounded-sm hover:bg-gray-100 hover:text-gray-600 hover:border-gray-400 hover:rounded-md duration-400",

    darkInverse:
      "bg-gray-100 text-gray-600 p-4 border-2 border-gray-400 rounded-md hover:bg-easyDark hover:text-white hover:border-easyDark hover:rounded-sm duration-400",

    primaryRounded:
      "rounded-md border-2 border-primary-300 bg-primary-300 text-white hover:bg-transparent hover:text-primary-300",

    outline:
      "rounded-md border-2 border-primary-300 bg-transparent text-primary-300 hover:bg-primary-300 hover:text-white",

    outlineInverse:
      "rounded-md border-2 border-white bg-transparent text-white hover:bg-primary-300",

    confirm:
      "rounded-md border-2 border-green-400 bg-green-400 text-white hover:bg-green-600",

    decline:
      "rounded-md border-2 border-red-400 bg-red-400 text-white hover:bg-red-600",

    confirmInverse:
      "rounded-md border-2 border-white bg-transparent text-white hover:bg-green-500 hover:border-green-200 hover:text-green-200",

    declineInverse:
      "rounded-md border-2 border-white bg-transparent text-white hover:bg-red-500 hover:border-red-200 hover:text-red-200",
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
