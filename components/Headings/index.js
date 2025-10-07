export default function Headings({
  children,
  headingType = "h2",
  className = "",
}) {
  const Tag = headingType;

  const sizeClasses = {
    h1: "text-6xl",
    h2: "text-5xl",
    h3: "text-3xl",
    h4: "text-lg",
  };

  return (
    <Tag
      className={` font-title ${sizeClasses[headingType] || ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
