'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const handleSignOut = async () => {
    try {
      await signOut({ 
        callbackUrl: '/login',
        redirect: true
      });
    } catch (error) {
      console.error('Error signing out:', error);
      window.location.href = '/login';
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground
        transition-colors duration-200"
    >
      <LogOut size={18} strokeWidth={1.5} />
      <span>Sign Out</span>
    </button>
  );
}