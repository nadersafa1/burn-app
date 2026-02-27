'use client'

import { ThemeProvider } from './theme-provider'
import { Toaster } from './ui/sonner'
import { ImpersonationIndicator } from './auth/impersonation-indicator'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
      {children}
      <Toaster richColors position='top-right' />
      <ImpersonationIndicator />
    </ThemeProvider>
  )
}
