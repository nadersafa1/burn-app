'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { PaginationConfig } from '@/lib/table-core'
import { BaseDataTable, TableControls, TableFilter, TablePagination, useTableSorting } from '@/lib/table-core'
import type { VisibilityState } from '@tanstack/react-table'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import * as React from 'react'
import type { AdminUser, AdminUsersSortBy } from '../types'
import { createAdminUsersColumns } from './admin-users-columns'

export interface AdminUsersTableProps {
  users: AdminUser[]
  pagination: PaginationConfig
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onSearchChange: (q: string) => void
  searchValue: string
  role: string
  onRoleChange: (role: string) => void
  sortBy?: AdminUsersSortBy
  sortOrder?: 'asc' | 'desc'
  onSortingChange: (sortBy?: AdminUsersSortBy, sortOrder?: 'asc' | 'desc') => void
  isLoading: boolean
  onRefetch: () => void
  onImpersonate: (user: AdminUser) => void
  onChangeRole: (user: AdminUser) => void
  onBan: (user: AdminUser) => void
  onUnban: (user: AdminUser) => void
  onDelete: (user: AdminUser) => void
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

const AdminUsersTable = ({
  users,
  pagination,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  searchValue,
  role,
  onRoleChange,
  sortBy,
  sortOrder,
  onSortingChange,
  isLoading,
  onImpersonate,
  onChangeRole,
  onBan,
  onUnban,
  onDelete,
}: AdminUsersTableProps) => {
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    createdAt: false,
  })

  const { handleSort } = useTableSorting<AdminUsersSortBy>({
    sortBy,
    sortOrder,
    onSortingChange,
  })

  const columns = React.useMemo(
    () =>
      createAdminUsersColumns({
        sortBy,
        sortOrder,
        onSort: id => handleSort(id as AdminUsersSortBy),
        onImpersonate,
        onChangeRole,
        onBan,
        onUnban,
        onDelete,
      }),
    [sortBy, sortOrder, handleSort, onImpersonate, onChangeRole, onBan, onUnban, onDelete]
  )

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
  })

  const getColumnLabel = React.useCallback((id: string) => {
    const labels: Record<string, string> = {
      name: 'Name',
      email: 'Email',
      role: 'Role',
      status: 'Status',
      createdAt: 'Created',
      actions: 'Actions',
    }
    return labels[id] ?? id
  }, [])

  return (
    <div className='w-full space-y-4'>
      <TableControls<AdminUser>
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder='Search by name or email...'
        searchDebounceMs={300}
        table={table}
        getColumnLabel={getColumnLabel}
        columnVisibility={columnVisibility}
        hasActiveFilters={!!(searchValue.trim() || role)}
        filters={
          <TableFilter label='Role' htmlFor='admin-role'>
            <Select value={role || 'all'} onValueChange={v => onRoleChange(v === 'all' ? '' : v)}>
              <SelectTrigger id='admin-role' className='w-full md:w-[180px]'>
                <SelectValue placeholder='All roles' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All roles</SelectItem>
                <SelectItem value='admin'>Admin</SelectItem>
                <SelectItem value='nutritionist'>Nutritionist</SelectItem>
                <SelectItem value='coach'>Coach</SelectItem>
                <SelectItem value='user'>User</SelectItem>
              </SelectContent>
            </Select>
          </TableFilter>
        }
        onResetFilters={() => {
          onSearchChange('')
          onRoleChange('')
        }}
        showResetButton
      />
      <BaseDataTable<AdminUser>
        data={users}
        columns={columns}
        pagination={pagination}
        isLoading={isLoading}
        emptyMessage='No users found.'
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
      />
      <TablePagination
        pagination={pagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
      />
    </div>
  )
}

export default AdminUsersTable
