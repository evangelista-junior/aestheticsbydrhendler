export function parseEmailConsultationRequest({ string, data, checkoutUrl }) {
  return string
    .replace(/{{customerName}}/g, data.name)
    .replace(/{{service}}/g, data.service)
    .replace(/{{date}}/g, data.preferedDate)
    .replace(/{{time}}/g, data.preferedTime)
    .replace(/{{notes}}/g, data.notes)
    .replace(/{{checkoutUrl}}/g, checkoutUrl)
    .replace(/{{rescheduleUrl}}/g, data.rescheduleUrl)
    .replace(/{{cancelUrl}}/g, data.cancelUrl)
    .replace(/{{year}}/g, new Date().getFullYear());
}
