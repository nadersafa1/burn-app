# Organization & Invitations (Backend)

Backend logic for organizations and invitations is implemented via **better-auth** organization plugin.

## Flow

1. **App admin** (user with `role === 'admin'`) creates an organization → they become **owner**.
2. App admin **invites corporate HR** with role **admin** via `organization.inviteMember({ email, role: 'admin' })`.
3. HR accepts the invitation (link in email) → becomes org **admin**.
4. Org admin **invites employees** with role **member** (max 100 members per org).
5. Employees accept → join the organization. Weekly rank can be derived from inbody data (separate feature).

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

## Accept-invitation link

Invitation emails use:

`{BETTER_AUTH_URL}/accept-invitation?invitationId={id}`

The **web app** should expose a route (e.g. `/accept-invitation`) that:

1. Reads `invitationId` from the query.
2. If the user is signed in: calls `authClient.organization.acceptInvitation({ invitationId })`, then redirects (e.g. dashboard).
3. If not signed in: redirect to login, then after login redirect back to `/accept-invitation?invitationId=...` to accept.

Native app can handle the same link via deep link and call `authClient.organization.acceptInvitation({ invitationId })` when the user is authenticated.

## Making a user an app admin

The **admin** plugin stores `role` on the `user` table. Set `user.role = 'admin'` (e.g. via DB or a one-off admin API) for the app admin account(s). Only those users can create organizations.
