# Organization & Invitations (Backend)

Backend logic for organizations and invitations is implemented via **better-auth** organization plugin.

## Flow

1. **App admin** (user with `role === 'admin'`) creates an organization → they become **owner**.
2. App admin **invites corporate HR** with role **client_admin** via `organization.inviteMember({ email, role: 'client_admin' })`.
3. HR accepts the invitation (link in email) → becomes org **client_admin**.
4. Owner or client_admin **invites** others with roles: **client_admin**, **direct_admin**, **nutritionist**, **coach**, or **member** (max 100 members per org).
5. Invitees accept → join the organization. See [docs/ROLES.md](ROLES.md) for role meanings.

## Backend configuration (`packages/auth`)

- **Who can create orgs:** Only app admins (`allowUserToCreateOrganization: user.role === 'admin'`).
- **Max members per org:** 100 (`membershipLimit: 100`).
- **Invitation email:** Sent via `sendInvitationEmail` → `sendOrganizationInvitation` (Brnit-branded email with accept link).
- **Invitation expiry:** 7 days (`organizationHooks.beforeCreateInvitation`).

## Better-auth API used (no extra backend code)

- **Create org:** `authClient.organization.create({ name, slug })` — app admin only.
- **Invite:** `authClient.organization.inviteMember({ email, role, organizationId?, resend? })`.
- **List invitations:** `authClient.organization.listInvitations({ organizationId? })`.
- **Accept invitation:** `authClient.organization.acceptInvitation({ invitationId })`.
- **Cancel invitation:** `authClient.organization.cancelInvitation({ invitationId })`.
- **Get invitation:** `authClient.organization.getInvitation({ id })`.
- **List members:** `authClient.organization.listMembers({ organizationId })`.
- **Remove member:** `authClient.organization.removeMember({ memberId, organizationId })`.
- **Update member role:** `authClient.organization.updateMemberRole({ memberId, role, organizationId })`.
- **Set active organization:** `authClient.organization.setActiveOrganization({ organizationId })` — persists on the session; use for org-scoped features and after accepting an invitation.

## Accept-invitation link

Invitation emails use:

`{BETTER_AUTH_URL}/accept-invitation?invitationId={id}`

The **web app** exposes `/accept-invitation` and:

1. Reads `invitationId` from the query.
2. If the user is signed in: calls `authClient.organization.acceptInvitation({ invitationId })`, then calls `setActiveOrganization` with the joined org when the API returns it, then redirects to dashboard.
3. If not signed in: redirect to login (and signup link preserves `invitationId`); after login/signup, redirect back to `/accept-invitation?invitationId=...` to accept.

**Native app:** Deep link `brnit://accept-invitation?invitationId={id}` opens the accept-invitation screen. If not signed in, user is sent to login with `invitationId`; after login they are redirected to accept-invitation. After `acceptInvitation` success, the app calls `setActiveOrganization` with the joined org when returned, then navigates to the main tabs.

## Active organization

The session stores `activeOrganizationId`. After a user accepts an invitation, the app sets the joined org as active via `setActiveOrganization`. On the organizations dashboard, changing the organization selector also calls `setActiveOrganization` so the session stays in sync. Any org-scoped API or server logic can read the active org from the session.

## Making a user an app admin

The **admin** plugin stores `role` on the `user` table. Set `user.role = 'admin'` (e.g. via DB or a one-off admin API) for the app admin account(s). Only those users can create organizations.
