export default function getCurrentTimeSyd() {
  const now = new Date();
  const utcTime = now.getTime();
  const sydneyOffset = 11 * 60 * 60 * 1000; // 11 horas em millisegundos
  const sydneyDate = new Date(utcTime + sydneyOffset);

  return sydneyDate;
}
