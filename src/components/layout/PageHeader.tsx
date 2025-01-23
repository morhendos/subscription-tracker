'use client';

import { HeaderControls } from '../settings/HeaderControls';

export function PageHeader() {
  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="w-32" />
        <h1 className="journal-heading text-4xl sm:text-5xl font-bold text-ink tracking-tight">
          Subscription Tracker
        </h1>
        <div className="w-32">
          <HeaderControls />
        </div>
      </div>
    </div>
  );
}