import ErrorLabel from "@/components/primary/ErrorLabel";

export default function TextArea({
  title,
  placeholder,
  hookFormArgs,
  errors,
  className,
}) {
  return (
    <div>
      <label className="block text-sm tracking-wider after:content-['*'] after:text-red-400 after:ml-1">
        {title}
      </label>
      <textarea
        rows={4}
        className={`${className} mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-easyDark/30`}
        placeholder={placeholder}
        {...hookFormArgs}
      />
      {errors && <ErrorLabel field={errors} />}
    </div>
  );
}
