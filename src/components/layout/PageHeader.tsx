import { ThemeToggle } from '@/components/ThemeToggle';

export function PageHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="space-y-1">
        <h1 className="text-4xl font-semibold journal-heading text-accent">
          Subscription Tracker
        </h1>
        <p className="text-sm text-ink/60">
          Track and manage your recurring payments
        </p>
      </div>
      <ThemeToggle />
    </div>
  );
}