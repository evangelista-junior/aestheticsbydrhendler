export function parseEmailConsultationRequest({
  string,
  data,
  checkoutUrl,
  bookingUrl,
}) {
  return string
    .replace(/{{customerName}}/g, data.name)
    .replace(/{{service}}/g, data.service)
    .replace(/{{date}}/g, data.preferedDate ? data.preferedDate : data.date)
    .replace(/{{time}}/g, data.preferedTime ? data.preferedTime : data.time)
    .replace(/{{notes}}/g, data.notes)
    .replace(/{{checkoutUrl}}/g, checkoutUrl)
    .replace(/{{bookingUrl}}/g, bookingUrl)
    .replace(/{{year}}/g, new Date().getFullYear());
}
