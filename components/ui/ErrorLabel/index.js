export default function ErrorLabel({ field }) {
  return (
    field && (
      <span className="px-2 text-sm text-primary-300 tracking-tight lowercase">
        {field.message}
      </span>
    )
  );
}
