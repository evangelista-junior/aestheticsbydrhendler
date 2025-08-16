export default function InputForm({ inputName, inputType, hookFormSettings }) {
  return (
    <div className="flex flex-col gap-0.5 w-full">
      <label className="text-sm font-medium text-gray-700">{inputName}</label>
      <input
        required
        {...hookFormSettings}
        type={inputType || "text"}
        className="
          w-full
          border border-gray-300
          bg-white
          p-2
          text-gray-700
          shadow-sm
          focus:border-primary-300
          focus:ring-2
          focus:ring-primary-200
          focus:outline-none
          transition
          duration-300
        "
      />
    </div>
  );
}
