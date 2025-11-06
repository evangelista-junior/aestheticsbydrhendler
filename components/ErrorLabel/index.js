export default function ErrorLabel({ field }) {
  return (
    field && (
      <span className="px-2 text-sm text-primary tracking-tight lowercase">
        {field.message}
      </span>
    )
  );
}
