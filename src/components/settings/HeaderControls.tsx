'use client';

import { Download, Upload, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useCallback } from 'react';

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
        text-foreground/70 hover:text-foreground dark:text-foreground/60 dark:hover:text-foreground
        transition-colors duration-200 ${className || ''}`}
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