import ErrorLabel from "@/components/ErrorLabel";

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
        className={`block text-sm tracking-wide ${
          isRequired && "after:content-['*'] after:text-red-400 after:ml-1"
        }`}
      >
        {title}
      </label>
      <textarea
        rows={4}
        className={`${className} mt-2 w-full shadow p-2 outline-none focus:ring-2 focus:ring-easyDark/30 
          ${errors && " placeholder-primary-300 text-primary-300"}
        `}
        placeholder={placeholder}
        {...hookFormArgs}
      />
      <ErrorLabel field={errors} />
    </div>
  );
}
