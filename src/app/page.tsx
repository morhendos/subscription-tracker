'use client';

import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { status } = useSession();

  if (status === 'loading') return null;
  
  if (status === 'unauthenticated') {
    redirect('/login');
  }

  redirect('/subscriptions');
}