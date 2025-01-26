/**
 * Converts an amount from one period to another
 * @param amount - The amount to convert
 * @param fromPeriod - The source billing period
 * @param toPeriod - The target billing period
 * @returns The converted amount
 */
export function convertBetweenPeriods(
  amount: number,
  fromPeriod: string,
  toPeriod: string
): number {
  // First convert to monthly
  let monthlyAmount = amount;
  switch (fromPeriod) {
    case 'weekly':
      monthlyAmount = amount * 4.33; // Average weeks in a month
      break;
    case 'yearly':
      monthlyAmount = amount / 12;
      break;
    case 'quarterly':
      monthlyAmount = amount / 3;
      break;
  }

  // Then convert from monthly to target period
  switch (toPeriod) {
    case 'weekly':
      return monthlyAmount / 4.33;
    case 'yearly':
      return monthlyAmount * 12;
    case 'quarterly':
      return monthlyAmount * 3;
    default: // monthly
      return monthlyAmount;
  }
}