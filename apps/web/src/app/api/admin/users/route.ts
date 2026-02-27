import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@burn-app/auth'
import { db } from '@burn-app/db'
import * as schema from '@burn-app/db/schema/auth'
import { and, count, desc, asc, ilike, eq, or } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

const DEFAULT_LIMIT = 25
const MAX_LIMIT = 100

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number.parseInt(searchParams.get('limit') ?? String(DEFAULT_LIMIT), 10))
  )
  const q = (searchParams.get('q') ?? '').trim()
  const roleFilter = searchParams.get('role') ?? ''
  const sortBy = searchParams.get('sortBy') ?? 'createdAt'
  const sortDir = searchParams.get('sortOrder') === 'asc' ? asc : desc

  const offset = (page - 1) * limit

  const conditions = []
  if (q) {
    const pattern = `%${q}%`
    conditions.push(or(ilike(schema.user.name, pattern), ilike(schema.user.email, pattern))!)
  }
  if (roleFilter) {
    conditions.push(eq(schema.user.role, roleFilter))
  }
  const where = conditions.length ? and(...conditions) : undefined

  const orderByColumn =
    sortBy === 'name'
      ? schema.user.name
      : sortBy === 'email'
        ? schema.user.email
        : sortBy === 'role'
          ? schema.user.role
          : schema.user.createdAt

  const [totalResult, users] = await Promise.all([
    db.select({ count: count() }).from(schema.user).where(where),
    db
      .select({
        id: schema.user.id,
        name: schema.user.name,
        email: schema.user.email,
        role: schema.user.role,
        banned: schema.user.banned,
        banReason: schema.user.banReason,
        banExpires: schema.user.banExpires,
        createdAt: schema.user.createdAt,
      })
      .from(schema.user)
      .where(where)
      .orderBy(sortDir(orderByColumn))
      .limit(limit)
      .offset(offset),
  ])

  const totalItems = totalResult[0]?.count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalItems / limit))

  return NextResponse.json({
    users,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
    },
  })
}
