export function checkIsRefundable({ bookingDate, bookingTime }) {
  const time = String(bookingTime)
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/);
  let [base, hour, minutes, periodOfDay] = time;
  hour = periodOfDay == "pm" ? hour + 12 : hour;

  const deadlineString = `${bookingDate}T${hour}:${minutes}:00`;
  const deadline = new Date(deadlineString);
  const today = new Date();

  const hoursBeforeBooking = (deadline - today) / (1000 * 60 * 60);
  return hoursBeforeBooking < 24 ? false : true;
}
