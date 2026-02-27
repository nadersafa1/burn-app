/**
 * Organization access control (ac) and roles.
 *
 * Org roles: owner, client_admin, direct_admin, nutritionist, coach, member.
 * See docs/ROLES.md for app-level and org-level role documentation.
 */
import {
  defaultStatements,
  ownerAc,
  adminAc,
  memberAc,
} from 'better-auth/plugins/organization/access'
import { createAccessControl } from 'better-auth/plugins/access'

export const ac = createAccessControl({
  ...defaultStatements,
})

export const owner = ac.newRole({
  ...ownerAc.statements,
})

export const client_admin = ac.newRole({
  ...adminAc.statements,
})

export const direct_admin = ac.newRole({
  ...memberAc.statements,
  member: ['update', 'delete'],
  invitation: [],
})

export const nutritionist = ac.newRole({
  ...memberAc.statements,
  member: [],
  invitation: [],
})

export const coach = ac.newRole({
  ...memberAc.statements,
  member: [],
  invitation: [],
})

export const member = ac.newRole({
  ...memberAc.statements,
})
