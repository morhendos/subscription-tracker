'use client'

import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react'
import { type Session } from 'next-auth'

export default function Providers({ 
  children,
  session
}: { 
  children: React.ReactNode
  session: Session | null
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider session={session}>
        {children}
      </SessionProvider>
    </ThemeProvider>
  )
}