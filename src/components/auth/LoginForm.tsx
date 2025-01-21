"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

export function LoginForm() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn('github', { callbackUrl: '/subscriptions' });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      type="button"
      disabled={loading}
      onClick={handleLogin}
      className="w-full"
    >
      {loading ? (
        'Loading...'
      ) : (
        <>
          <Github className="mr-2 h-4 w-4" /> Continue with GitHub
        </>
      )}
    </Button>
  );
}
