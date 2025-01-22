'use client';

import { Currency, SubscriptionSummary as Summary } from '@/types/subscriptions';
import { formatCurrency } from '@/utils/format';

interface SubscriptionSummaryProps {
  summary: Summary;
}

export function SubscriptionSummary({ summary }: SubscriptionSummaryProps) {
  const hasOriginalAmounts = Object.values(summary.originalAmounts).some(amount => amount > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Monthly"
          amount={summary.totalMonthly}
          period="per month"
        />
        <SummaryCard
          title="Yearly"
          amount={summary.totalYearly}
          period="per year"
        />
        <SummaryCard
          title="Weekly"
          amount={summary.totalWeekly}
          period="per week"
        />
        <SummaryCard
          title="Quarterly"
          amount={summary.totalQuarterly}
          period="per quarter"
        />
      </div>

      {hasOriginalAmounts && (
        <div className="bg-paper border border-border rounded-lg p-4">
          <h4 className="text-sm font-medium text-ink/60 mb-3">Original Currency Amounts</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(summary.originalAmounts)
              .filter(([_, amount]) => amount > 0)
              .map(([currency, amount]) => (
                <div key={currency}>
                  <p className="text-lg font-semibold journal-text">
                    {formatCurrency(amount, currency as Currency)}
                  </p>
                  <p className="text-sm text-ink/60">Total in {currency}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="bg-accent/10 rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium journal-text mb-2">
          Total Monthly Spending
        </h3>
        <p className="text-2xl font-semibold text-accent">
          {formatCurrency(summary.grandTotalMonthly, 'EUR')}
        </p>
        <p className="text-sm text-ink/60 mt-1">
          All subscriptions converted to EUR monthly rate
        </p>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  amount: number;
  period: string;
}

function SummaryCard({ title, amount, period }: SummaryCardProps) {
  return (
    <div className="bg-paper border border-border rounded-lg p-4">
      <h4 className="text-sm font-medium text-ink/60 mb-1">{title}</h4>
      <p className="text-xl font-semibold journal-text">{formatCurrency(amount, 'EUR')}</p>
      <p className="text-sm text-ink/60">{period}</p>
    </div>
  );
}