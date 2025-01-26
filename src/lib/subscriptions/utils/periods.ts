export function convertBetweenPeriods(
  amount: number,
  fromPeriod: string,
  toPeriod: string
): number {
  let monthlyAmount = amount;
  switch (fromPeriod) {
    case 'weekly':
      monthlyAmount = amount * 4.33;
      break;
    case 'yearly':
      monthlyAmount = amount / 12;
      break;
    case 'quarterly':
      monthlyAmount = amount / 3;
      break;
  }

  switch (toPeriod) {
    case 'weekly':
      return monthlyAmount / 4.33;
    case 'yearly':
      return monthlyAmount * 12;
    case 'quarterly':
      return monthlyAmount * 3;
    default:
      return monthlyAmount;
  }
}