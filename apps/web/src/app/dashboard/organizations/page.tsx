import { auth } from '@burn-app/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import OrganizationsContent from './organizations-content'

export default async function OrganizationsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/login')
  }

  return <OrganizationsContent />
}
