"use client";

import { Plus } from 'lucide-react';

interface AddSubscriptionButtonProps {
  onClick: () => void;
}

export function AddSubscriptionButton({ onClick }: AddSubscriptionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex-1 bg-accent/10 text-accent hover:bg-accent/15
        py-3 px-6 rounded-md transition-all duration-200
        flex items-center justify-center gap-2 group journal-text journal-button"
    >
      <Plus size={18} className="group-hover:scale-105 transition-transform" strokeWidth={1.5} />
      Add Subscription
    </button>
  );
}
