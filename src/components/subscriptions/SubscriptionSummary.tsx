import { SubscriptionSummary as Summary } from '@/types/subscriptions';
import { formatCurrency } from '@/utils/format';

interface SubscriptionSummaryProps {
  summary: Summary;
}

export function SubscriptionSummary({ summary }: SubscriptionSummaryProps) {
  const hasWeekly = summary.totalWeekly > 0;
  const hasMonthly = summary.totalMonthly > 0;
  const hasQuarterly = summary.totalQuarterly > 0;
  const hasYearly = summary.totalYearly > 0;

  const originalTotals = Object.entries(summary.originalAmounts)
    .filter(([_, amount]) => amount > 0)
    .map(([currency, amount]) => formatCurrency(amount, currency as any))
    .join(' + ');

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {hasWeekly && (
          <div className="bg-paper dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-sm font-medium text-muted">Weekly Subscriptions</div>
            <div className="mt-1 text-lg font-semibold text-foreground">
              {formatCurrency(summary.totalWeekly, 'EUR')}
            </div>
          </div>
        )}

        {hasMonthly && (
          <div className="bg-paper dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-sm font-medium text-muted">Monthly Subscriptions</div>
            <div className="mt-1 text-lg font-semibold text-foreground">
              {formatCurrency(summary.totalMonthly, 'EUR')}
            </div>
          </div>
        )}

        {hasQuarterly && (
          <div className="bg-paper dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-sm font-medium text-muted">Quarterly Subscriptions</div>
            <div className="mt-1 text-lg font-semibold text-foreground">
              {formatCurrency(summary.totalQuarterly, 'EUR')}
            </div>
          </div>
        )}

        {hasYearly && (
          <div className="bg-paper dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-sm font-medium text-muted">Yearly Subscriptions</div>
            <div className="mt-1 text-lg font-semibold text-foreground">
              {formatCurrency(summary.totalYearly, 'EUR')}
            </div>
          </div>
        )}
      </div>

      <div className="bg-paper dark:bg-gray-800 p-4 rounded-lg border-2 border-indigo-500">
        <div className="text-sm font-medium text-muted">Monthly Total (All Subscriptions)</div>
        <div className="mt-1 text-lg font-semibold text-foreground">
          {formatCurrency(summary.grandTotalMonthly, 'EUR')}
        </div>
        <div className="mt-1 text-xs text-muted">
          Original amounts: {originalTotals}
        </div>
      </div>
    </div>
  );
}