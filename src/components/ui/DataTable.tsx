import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { Input } from './Input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './Table'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchPlaceholder?: string
  className?: string
  enableSorting?: boolean
  enableFiltering?: boolean
  enablePagination?: boolean
  pageSize?: number
  loading?: boolean
  error?: string
  emptyState?: any
  enableRowSelection?: boolean
  onSelectionChange?: (ids: string[]) => void
  variant?: 'dense' | 'default'
  stickyHeader?: boolean
  enableColumnVisibility?: boolean
  enableColumnResizing?: boolean
}

export function DataTable<TData, TValue>(
  props: DataTableProps<TData, TValue> & Record<string, any>
) {
  const {
    columns,
    data,
    searchPlaceholder = 'Filter...',
    className,
    enableSorting = true,
    enableFiltering = true,
    enablePagination = true,
    pageSize = 10,
    loading = false,
    error,
    emptyState,
    enableRowSelection = false,
    onSelectionChange,
    variant,
    stickyHeader = false,
    enableColumnVisibility = false,
    enableColumnResizing = false,
    ...rest
  } = props

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showColumnMenu, setShowColumnMenu] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: { sorting, columnFilters, globalFilter },
    initialState: { pagination: { pageSize } },
  })

  // split aria props to pass to the inner table element
  const tableAriaProps: Record<string, any> = {}
  const rootProps: Record<string, any> = {}
  Object.keys(rest).forEach((k) => {
    if (k.startsWith('aria-') || k === 'role') tableAriaProps[k] = (rest as any)[k]
    else rootProps[k] = (rest as any)[k]
  })

  const rows = table.getRowModel().rows

  return (
    <div
      {...rootProps}
      className={cn('space-y-4', variant === 'dense' && 'table-dense', className)}
    >
      {error && <div className="text-red-600">{error}</div>}
      {enableFiltering && (
        <div className="flex items-center justify-between">
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
          {enableColumnVisibility && (
            <div>
              <button onClick={() => setShowColumnMenu((s) => !s)}>Columns</button>
              {showColumnMenu && (
                <div>
                  {columns.map((col: any) => (
                    <label key={String(col.accessorKey)}>
                      <input type="checkbox" defaultChecked /> {col.header}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="rounded-md border">
        <Table {...tableAriaProps} className={cn('', stickyHeader && 'sticky')}>
          <TableHeader className={cn(stickyHeader && 'sticky')}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {enableRowSelection && (
                  <TableHead>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.currentTarget.checked) {
                          const ids = rows.map((r) => String((r.original as any).id))
                          setSelectedIds(ids)
                          onSelectionChange?.(ids)
                        } else {
                          setSelectedIds([])
                          onSelectionChange?.([])
                        }
                      }}
                    />
                  </TableHead>
                )}
                {headerGroup.headers.map((header) => {
                  const sortState = header.column.getIsSorted()
                  const ariaSort =
                    sortState === 'asc'
                      ? 'ascending'
                      : sortState === 'desc'
                        ? 'descending'
                        : undefined
                  return (
                    <TableHead
                      key={header.id}
                      className="font-medium"
                      {...(ariaSort ? { 'aria-sort': ariaSort } : {})}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            'flex items-center space-x-2',
                            header.column.getCanSort() &&
                              'cursor-pointer select-none hover:bg-accent'
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                          {enableSorting && header.column.getCanSort() && (
                            <span className="ml-2">
                              {header.column.getIsSorted() === 'asc' ? (
                                <ArrowUp className="h-4 w-4" />
                              ) : header.column.getIsSorted() === 'desc' ? (
                                <ArrowDown className="h-4 w-4" />
                              ) : (
                                <ArrowUpDown className="h-4 w-4 opacity-50" />
                              )}
                            </span>
                          )}
                          {enableColumnResizing && (
                            <div role="separator" className="ml-2 h-6 w-0.5 bg-gray-300" />
                          )}
                        </div>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (enableRowSelection ? 1 : 0)}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : rows?.length ? (
              rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {enableRowSelection && (
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(String((row.original as any).id))}
                        onChange={(e) => {
                          const id = String((row.original as any).id)
                          const next = e.currentTarget.checked
                            ? [...selectedIds, id]
                            : selectedIds.filter((i) => i !== id)
                          setSelectedIds(next)
                          onSelectionChange?.(next)
                        }}
                      />
                    </TableCell>
                  )}
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (enableRowSelection ? 1 : 0)}
                  className="h-24 text-center"
                >
                  {emptyState ?? 'No data available'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {enablePagination && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Showing{' '}
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            of {table.getFilteredRowModel().rows.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <span className="flex items-center gap-1">
              <strong>
                {`Page ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount()}`}
              </strong>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
