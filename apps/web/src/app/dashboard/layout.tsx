import { auth } from '@burn-app/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import DashboardLayoutClient from './dashboard-layout-client'

export default async function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/login')
  }

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}
