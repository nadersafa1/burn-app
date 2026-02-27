'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { authClient } from '@/lib/auth-client'
import CreateOrgForm from './create-org-form'
import InvitationsList from './invitations-list'
import InviteMemberForm from './invite-member-form'
import MembersList from './members-list'
import OrganizationSelect from './organization-select'
import { useOrgMembers } from './use-org-members'

const CAN_INVITE_ROLES = new Set(['owner', 'client_admin', 'org_admin'])

const OrganizationsContent = () => {
  const router = useRouter()
  const [inviteRefetchTrigger, setInviteRefetchTrigger] = useState(0)
  const { data: session } = authClient.useSession()
  const { data: organizations } = authClient.useListOrganizations()
  const { data: activeOrganization } = authClient.useActiveOrganization()

  const isAppAdmin = session?.user?.role === 'admin'
  const activeId = activeOrganization?.id ?? null
  const selectedOrg = organizations?.find((o: { id: string }) => o.id === activeId)

  const { members } = useOrgMembers(activeId)

  const selectedMemberRole = members.find(m => m.userId === session?.user?.id)?.role ?? null

  const canInvite = activeId && selectedOrg && (CAN_INVITE_ROLES.has(selectedMemberRole ?? '') || isAppAdmin)

  const handleOrgCreated = () => router.refresh()
  const handleInviteSent = () => {
    setInviteRefetchTrigger(n => n + 1)
    router.refresh()
  }

  return (
    <div className='space-y-6'>
      <h2 className='text-lg font-semibold'>Organizations</h2>

      {isAppAdmin && <CreateOrgForm onSuccess={handleOrgCreated} />}

      <OrganizationSelect />

      {activeId && canInvite && (
        <div className='grid gap-6 md:grid-cols-2'>
          <InviteMemberForm organizationId={activeId} onSuccess={handleInviteSent} />
          <InvitationsList organizationId={activeId} refetchTrigger={inviteRefetchTrigger} />
        </div>
      )}

      {activeId && !canInvite && (
        <p className='text-muted-foreground text-sm'>
          Only owners and client admins can invite members. Your role in this organization does not allow invitations.
        </p>
      )}

      {activeId && <MembersList organizationId={activeId} currentUserRole={selectedMemberRole ?? null} />}

      {(!organizations || organizations.length === 0) && !isAppAdmin && (
        <p className='text-muted-foreground text-sm'>
          You are not in any organization yet. Ask an admin to invite you.
        </p>
      )}
    </div>
  )
}

export default OrganizationsContent
