'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import { signOut } from 'next-auth/react';

export function PageHeader() {
  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <button
          onClick={() => signOut()}
          className="text-ink/60 hover:text-ink transition-colors"
        >
          Sign out
        </button>
        <h1 className="journal-heading text-4xl sm:text-5xl font-bold text-ink tracking-tight">
          Subscriptions
        </h1>
        <div className="w-32 flex justify-end">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}