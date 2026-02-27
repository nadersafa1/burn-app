'use client'

import { useCallback, useEffect, useState } from 'react'

import { authClient } from '@/lib/auth-client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import CreateOrgForm from './create-org-form'
import InvitationsList from './invitations-list'
import InviteMemberForm from './invite-member-form'
import MembersList from './members-list'

const CAN_INVITE_ROLES = new Set(['owner', 'client_admin'])
const NO_ORG_VALUE = '__none__'

const OrganizationsPage = () => {
  const { data: session } = authClient.useSession()
  const { data: organizations, refetch: refetchOrgs } =
    authClient.useListOrganizations?.() ?? { data: [], refetch: () => {} }
  const activeOrg = (authClient.useActiveOrganization?.() as { data?: { id?: string } } | undefined)?.data
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null)
  const [inviteRefetchTrigger, setInviteRefetchTrigger] = useState(0)

  useEffect(() => {
    if (activeOrg?.id && organizations?.length) {
      const inList = organizations.some((o: { id: string }) => o.id === activeOrg.id)
      if (inList && !selectedOrgId) setSelectedOrgId(activeOrg.id)
    }
  }, [activeOrg?.id, organizations, selectedOrgId])

  const isAppAdmin = session?.user?.role === 'admin'
  const selectedOrg = organizations?.find((o: { id: string }) => o.id === selectedOrgId)
  const selectedMemberRole =
    (selectedOrg as { role?: string; organizationRole?: string } | undefined)?.role ??
    (selectedOrg as { organizationRole?: string } | undefined)?.organizationRole ??
    null
  const normalizedRole = selectedMemberRole?.toLowerCase()
  const canInvite =
    selectedOrgId &&
    selectedOrg &&
    (CAN_INVITE_ROLES.has(normalizedRole ?? '') || isAppAdmin)

  const handleOrgSelect = useCallback(
    async (v: string) => {
      const nextId = v === NO_ORG_VALUE ? null : v
      setSelectedOrgId(nextId)
      if (nextId) {
        const setActive = (authClient.organization as { setActiveOrganization?: (p: { organizationId: string }) => Promise<unknown> }).setActiveOrganization
        if (setActive) await setActive({ organizationId: nextId })
        refetchOrgs?.()
      }
    },
    [refetchOrgs]
  )

  const handleOrgCreated = useCallback(() => {
    refetchOrgs?.()
  }, [refetchOrgs])

  const handleInviteSent = useCallback(() => {
    setInviteRefetchTrigger((n) => n + 1)
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Organizations</h2>

      {isAppAdmin && (
        <CreateOrgForm onSuccess={handleOrgCreated} />
      )}

      {organizations && organizations.length > 0 && (
        <div className="space-y-2">
          <label htmlFor="org-select" className="text-sm font-medium">
            Select organization
          </label>
          <Select
            value={selectedOrgId ?? NO_ORG_VALUE}
            onValueChange={handleOrgSelect}
          >
            <SelectTrigger id="org-select" className="w-full max-w-xs">
              <SelectValue placeholder="—" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_ORG_VALUE}>—</SelectItem>
              {organizations.map((org: { id: string; name: string }) => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedOrgId && canInvite && (
        <div className="grid gap-6 md:grid-cols-2">
          <InviteMemberForm
            organizationId={selectedOrgId}
            onSuccess={handleInviteSent}
          />
          <InvitationsList
            organizationId={selectedOrgId}
            refetchTrigger={inviteRefetchTrigger}
          />
        </div>
      )}

      {selectedOrgId && !canInvite && (
        <p className="text-muted-foreground text-sm">
          Only owners and client admins can invite members. Your role in this
          organization does not allow invitations.
        </p>
      )}

      {selectedOrgId && (
        <MembersList
          organizationId={selectedOrgId}
          currentUserRole={selectedMemberRole ?? null}
        />
      )}

      {(!organizations || organizations.length === 0) && !isAppAdmin && (
        <p className="text-muted-foreground text-sm">
          You are not in any organization yet. Ask an admin to invite you.
        </p>
      )}
    </div>
  )
}

export default OrganizationsPage
