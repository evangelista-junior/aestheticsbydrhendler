import ErrorLabel from "@/components/ErrorLabel";

export default function Input({
  labelTitle,
  inputPlaceholder,
  inputAutoComplete,
  inputType,
  hookFormArgs,
  errors,
  minDate,
}) {
  return (
    <div className="">
      <label className="block text-sm tracking-wide after:content-['*'] after:text-red-400 after:ml-1">
        {labelTitle}
      </label>
      <input
        type={inputType}
        className={`mt-2 w-full shadow p-2 outline-none focus:ring-2 focus:ring-easyDark/30
                    ${errors && "placeholder-primary-300 text-primary-300"}`}
        placeholder={inputPlaceholder}
        autoComplete={inputAutoComplete}
        min={minDate}
        {...hookFormArgs}
      />
      <ErrorLabel field={errors} />
    </div>
  );
}
