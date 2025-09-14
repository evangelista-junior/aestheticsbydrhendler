import ErrorLabel from "@/components/primary/ErrorLabel";

export default function SelectInput({
  labelTitle,
  hookFormArgs,
  options,
  errors,
}) {
  return (
    <div>
      <label className="block text-sm tracking-wider after:content-['*'] after:text-red-400">
        {labelTitle}
      </label>

      <select
        className={`mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-easyDark/30 dark:focus:ring-white/30
                    ${
                      errors
                        ? "border-primary-300 placeholder-primary-300 text-primary-300"
                        : "border-gray-300"
                    }`}
        {...hookFormArgs}
      >
        <option value="">{labelTitle}</option>
        {options.map((o, i) => (
          <option key={i} value={o}>
            {o}
          </option>
        ))}
      </select>
      {errors && <ErrorLabel field={errors} />}
    </div>
  );
}
