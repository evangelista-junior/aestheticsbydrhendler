export function parseContactEmail({
  string,
  contactName,
  contactEmail,
  contactPhone,
  contactMessage,
}) {
  return string
    .replace(/{{name}}/g, contactName)
    .replace(/{{email}}/g, contactEmail)
    .replace(/{{phone}}/g, contactPhone)
    .replace(/{{message}}/g, contactMessage)
    .replace(/{{year}}/g, new Date().getFullYear());
}
