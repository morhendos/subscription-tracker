'use client';

import { Download, Upload, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

function Controls({
  theme,
  toggleTheme,
  mounted,
  storageActions
}: {
  theme: string;
  toggleTheme: () => void;
  mounted: boolean;
  storageActions: { importData: (data: unknown) => Promise<void>; exportData: () => void; }
}) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const handleImport = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        await storageActions.importData(data);
      } catch (error) {
        console.error('Error importing data:', error);
        alert('Error importing data. Please check the file format.');
      }
    };

    input.click();
  }, [storageActions]);

  return (
    <div className="flex justify-end gap-2">
      <HeaderButton
        onClick={handleImport}
        aria-label="Import subscriptions"
      >
        <Upload size={20} strokeWidth={1.5} />
      </HeaderButton>

      <HeaderButton
        onClick={storageActions.exportData}
        aria-label="Export subscriptions"
      >
        <Download size={20} strokeWidth={1.5} />
      </HeaderButton>

      <HeaderButton
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {mounted && (
          theme === 'dark' ? (
            <Sun size={20} strokeWidth={1.5} />
          ) : (
            <Moon size={20} strokeWidth={1.5} />
          )
        )}
      </HeaderButton>

      <HeaderButton
        onClick={handleSignOut}
        aria-label="Sign out"
        className="text-destructive hover:text-destructive/90 transition-colors duration-200"
      >
        <LogOut size={20} strokeWidth={1.5} />
      </HeaderButton>
    </div>
  );
}

function HeaderButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`w-10 h-10 rounded-full flex items-center justify-center
        text-ink/70 hover:text-ink transition-colors duration-200 ${className || ''}`}
    >
      {children}
    </button>
  );
}

export function HeaderControls() {
  const { theme, toggleTheme, mounted } = useTheme();
  
  return (
    <Controls
      theme={theme}
      mounted={mounted}
      toggleTheme={toggleTheme}
      storageActions={{
        importData: async (data) => {
          localStorage.setItem('subscriptions', JSON.stringify(data));
          window.location.reload();
        },
        exportData: () => {
          const data = localStorage.getItem('subscriptions') || '[]';
          const blob = new Blob([data], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'subscriptions.json';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }}
    />
  );
}