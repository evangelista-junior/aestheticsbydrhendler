import ErrorLabel from "@/components/ErrorLabel";

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
        className={`mt-2 w-full shadow px-1 py-2.5 outline-none focus:ring-2 focus:ring-easyDark/30 placeholder:text-red-900
                    ${errors & "placeholder-primary-300 text-primary-300"}`}
        {...hookFormArgs}
      >
        <option value={labelTitle}>{labelTitle}</option>
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
