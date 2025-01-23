'use client';

import { usePathname } from 'next/navigation';

export function PageHeader() {
  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex justify-center items-center">
        <h1 className="journal-heading text-4xl sm:text-5xl font-bold text-ink tracking-tight">
          Subscription Tracker
        </h1>
      </div>
    </div>
  );
}