import { sendEmail } from '../send-email'

export async function sendOrganizationInvitation({
  email,
  invitedByUsername,
  invitedByEmail,
  organizationName,
  inviteLink,
}: {
  email: string
  invitedByUsername: string
  invitedByEmail: string
  organizationName: string
  inviteLink: string
}) {
  await sendEmail({
    to: email,
    subject: `You're invited to join ${organizationName}`,
    meta: {
      description: `${invitedByUsername} (${invitedByEmail}) has invited you to join ${organizationName} on Brnit. Accept to join the group and start your health challenge.`,
      link: inviteLink,
      linkText: 'Accept invitation',
    },
  })
}
