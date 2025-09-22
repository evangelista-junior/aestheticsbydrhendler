import ErrorLabel from "@/components/primary/ErrorLabel";

export default function TextArea({
  title,
  placeholder,
  hookFormArgs,
  errors,
  className,
  isRequired = false,
}) {
  return (
    <div>
      <label
        className={`block text-sm tracking-wider ${
          isRequired && "after:content-['*'] after:text-red-400 after:ml-1"
        }`}
      >
        {title}
      </label>
      <textarea
        rows={4}
        className={`${className} mt-2 w-full border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-easyDark/30 
          ${
            errors
              ? "border-primary-300 placeholder-primary-300 text-primary-300"
              : "border-gray-300"
          }
        `}
        placeholder={placeholder}
        {...hookFormArgs}
      />
      <ErrorLabel field={errors} />
    </div>
  );
}
