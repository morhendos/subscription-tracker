'use client';

import Link from 'next/link';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  return (
    <Link
      href="/auth/signout"
      className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
    >
      <LogOut className="h-4 w-4" />
      <span>Sign out</span>
    </Link>
  );
}