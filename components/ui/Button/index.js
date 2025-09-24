export default function Button({
  children,
  type,
  disabled,
  buttonType = "primary" |
    "dark" |
    "primaryRounded" |
    "outline" |
    "outlineInverse" |
    "confirm" |
    "confirmInverse" |
    "decline" |
    "declineInverse",
  className,
  onClick,
}) {
  let buttonAttributes =
    "flex justify-center items-center gap-2 cursor-pointer transition-all duration-300 uppercase tracking-wider shadow-2xl p-2 px-4 ";

  switch (buttonType) {
    case "primary":
      buttonAttributes +=
        " bg-primary-300 text-white text-shadow-md hover:scale-105";
      break;
    case "dark":
      buttonAttributes +=
        " bg-easyDark text-white p-4 border-2 border-easyDark rounded-sm hover:bg-gray-100 hover:text-gray-600 hover:border-gray-400 hover:rounded-md duration-400";
      break;
    case "primaryRounded":
      buttonAttributes +=
        " rounded-md border-2 border-primary-300 bg-primary-300 text-white hover:bg-transparent hover:text-primary-300";
      break;
    case "outline":
      buttonAttributes +=
        " rounded-md border-2 border-primary-300 bg-transparent text-primary-300 hover:bg-primary-300 hover:text-white";
      break;
    case "outlineInverse":
      buttonAttributes +=
        " rounded-md border-2 border-white bg-transparent text-white hover:bg-primary-300";
      break;
    case "confirm":
      buttonAttributes +=
        " rounded-md border-2 border-green-200 bg-green-100 text-white hover:bg-transparent hover:text-green-300";
      break;
    case "decline":
      buttonAttributes +=
        " rounded-md border-2 border-red-200 bg-red-400 text-white hover:bg-transparent hover:text-red-300";
      break;
    case "confirmInverse":
      buttonAttributes +=
        " rounded-md border-2 border-white bg-transparent text-white hover:bg-green-500 hover:border-green-200 hover:text-green-200";
      break;
    case "declineInverse":
      buttonAttributes +=
        " rounded-md border-2 border-white bg-transparent text-white hover:bg-red-500 hover:border-red-200 hover:text-red-200";
      break;
  }

  return (
    <button
      type={type}
      className={`${buttonAttributes} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
