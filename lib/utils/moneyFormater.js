export default function moneyFormater(value) {
  return Number(value / 100).toFixed(2);
}
