export function bookingDateValidation(pickedDate) {
  let dayOfTheWeek = new Date(pickedDate).getDay();
  if (dayOfTheWeek > 1) return "Treatments available only on Sunday or Monday.";
}
