'use client';

import { Plus } from 'lucide-react';

interface AddSubscriptionButtonProps {
  onClick: () => void;
}

export function AddSubscriptionButton({ onClick }: AddSubscriptionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg hover:bg-accent/10 text-ink/50 hover:text-accent transition-colors"
      aria-label="Add subscription"
    >
      <Plus size={20} />
    </button>
  );
}