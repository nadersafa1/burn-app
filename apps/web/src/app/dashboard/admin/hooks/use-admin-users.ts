'use client'

import { useCallback, useEffect, useState } from 'react'
import type { AdminUsersFilters, AdminUsersResponse } from '../types'

const defaultFilters: AdminUsersFilters = {
  q: '',
  role: '',
  page: 1,
  limit: 25,
  sortBy: 'createdAt',
  sortOrder: 'desc',
}

export function useAdminUsers() {
  const [filters, setFilters] = useState<AdminUsersFilters>(defaultFilters)
  const [data, setData] = useState<AdminUsersResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async (f: AdminUsersFilters) => {
    setIsLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.set('page', String(f.page))
      params.set('limit', String(f.limit))
      params.set('sortBy', f.sortBy)
      params.set('sortOrder', f.sortOrder)
      if (f.q) params.set('q', f.q)
      if (f.role) params.set('role', f.role)
      const res = await fetch(`/api/admin/users?${params}`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Failed to fetch users')
      }
      const json: AdminUsersResponse = await res.json()
      setData(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch users')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers(filters)
  }, [filters, fetchUsers])

  const setFiltersAndFetch = useCallback((next: Partial<AdminUsersFilters>) => {
    setFilters((prev) => ({ ...prev, ...next }))
  }, [])

  const refetch = useCallback(() => fetchUsers(filters), [filters, fetchUsers])

  return {
    users: data?.users ?? [],
    pagination: data?.pagination ?? {
      page: 1,
      limit: filters.limit,
      totalItems: 0,
      totalPages: 1,
    },
    filters,
    setFilters: setFiltersAndFetch,
    isLoading,
    error,
    refetch,
    clearError: () => setError(null),
  }
}
