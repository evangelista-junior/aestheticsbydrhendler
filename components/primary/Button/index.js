export default function Button({
  children,
  type,
  buttonType = "primary" |
    "dark" |
    "primaryRounded" |
    "outline" |
    "outlineInverse",
  className,
}) {
  let buttonAttributes =
    "flex justify-center items-center gap-2 cursor-pointer transition-all duration-300 ";

  switch (buttonType) {
    case "primary":
      buttonAttributes += `uppercase tracking-wider shadow-2xl bg-primary-300 text-white text-shadow-md p-2 px-4
        hover:scale-105 transition-all duration-300`;
      break;
    case "dark":
      buttonAttributes += `uppercase tracking-wider shadow-2xl bg-easyDark text-white p-4 border-2 border-easyDark rounded-sm
        hover:bg-gray-100 hover:text-gray-600 hover:border-gray-400 hover:rounded-md transition-all duration-400`;
      break;
    case "primaryRounded":
      buttonAttributes +=
        " rounded-md border-2 border-primary-300 bg-primary-300 shadow-2xl uppercase p-2 px-4 text-white hover:bg-transparent hover:text-primary-300";
      break;
    case "outline":
      buttonAttributes +=
        " rounded-md border-2 border-primary-300 bg-transparent shadow-2xl uppercase p-2 px-4 text-primary-300 hover:bg-primary-300 hover:text-white";
      break;
    case "outlineInverse":
      buttonAttributes +=
        " uppercase rounded-md border-2 border-white bg-transparent tracking-widest shadow-2xl p-2 px-4 text-white hover:bg-primary-300 hover:text-white";
      break;
  }

  return (
    <button {...type} className={`${buttonAttributes} ${className}`}>
      {children}
    </button>
  );
}
