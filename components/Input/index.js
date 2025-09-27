import ErrorLabel from "@/components/ErrorLabel";

export default function Input({
  labelTitle,
  inputPlaceholder,
  inputAutoComplete,
  inputType,
  hookFormArgs,
  errors,
}) {
  return (
    <div>
      <label className="block text-sm tracking-wider after:content-['*'] after:text-red-400 after:ml-1">
        {labelTitle}
      </label>
      <input
        type={inputType}
        className={`mt-2 w-full border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-easyDark/30
                    ${
                      errors
                        ? "border-primary-300 placeholder-primary-300 text-primary-300"
                        : "border-gray-300"
                    }`}
        placeholder={inputPlaceholder}
        autoComplete={inputAutoComplete}
        {...hookFormArgs}
      />
      <ErrorLabel field={errors} />
    </div>
  );
}
