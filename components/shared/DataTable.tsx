'use client'

import type { ColumnDef } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { CSSProperties } from 'react'
import type { RefObject } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils/style'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  isFetchingMore?: boolean
  tableContainerClassName?: string
  theadRowClassName?: string
  noRecordTitle?: string
  noRecordDescription?: string
  showNoRecords?: boolean
  wrapperClassName?: string
  onRowClick?: (row: TData) => void
  isRowActive?: (row: TData) => boolean

  stickyData?: TData

  stickyPosition?: 'top' | 'bottom'
  scrollRef?: RefObject<HTMLDivElement | null>
  sentinelRef?: RefObject<HTMLDivElement | null>

  activeRowRef?: RefObject<HTMLTableRowElement | null>
  rowClassName?: string | ((row: TData, rowIndex: number) => string)
  rowStyle?: (row: TData, rowIndex: number) => CSSProperties | undefined
}

const STICKY_ROW_CLASS =
  'data-[state=selected]:bg-[#24102C] bg-[#24102C]! outline outline-[#DE8BF3]'

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  isFetchingMore = false,
  tableContainerClassName = '',
  theadRowClassName = '',
  noRecordTitle = 'No results',
  noRecordDescription = '',
  showNoRecords = true,
  wrapperClassName = '',
  onRowClick,
  isRowActive,
  stickyData,
  stickyPosition = 'bottom',
  scrollRef,
  sentinelRef,
  activeRowRef,
  rowClassName,
  rowStyle,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const renderStickyRowCells = (rowData: TData) =>
    table.getAllColumns().map(column => {
      const meta = column.columnDef.meta as { tdClassName?: string } | undefined
      return (
        <TableCell key={column.id} className={meta?.tdClassName}>
          {flexRender(column.columnDef.cell, {
            getValue: () =>
              (rowData as Record<string, unknown>)[column.id] as never,
            row: { original: rowData } as never,
            column: column as never,
            table: table as never,
            cell: {} as never,
            renderValue: () => null as never,
          })}
        </TableCell>
      )
    })

  return (
    <div className={cn('overflow-hidden rounded-lg', wrapperClassName)}>
      <Table
        tableContainerClassName={tableContainerClassName}
        scrollRef={scrollRef}
      >
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow
              key={headerGroup.id}
              className={cn('hover:bg-transparent', theadRowClassName)}
            >
              {headerGroup.headers.map(header => {
                const meta = header.column.columnDef.meta as
                  | { thClassName?: string }
                  | undefined
                return (
                  <TableHead key={header.id} className={meta?.thClassName}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {stickyData && stickyPosition === 'top' && (
            <TableRow className={cn('sticky top-1 z-10', STICKY_ROW_CLASS)}>
              {renderStickyRowCells(stickyData)}
            </TableRow>
          )}

          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                {columns.map((_, cellIndex) => (
                  <TableCell key={`skeleton-cell-${index}-${cellIndex}`}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            <>
              {table.getRowModel().rows.map((row, rowIndex) => {
                const active = isRowActive?.(row.original)
                const resolvedRowClassName =
                  typeof rowClassName === 'function'
                    ? rowClassName(row.original, rowIndex)
                    : rowClassName
                const resolvedRowStyle = rowStyle?.(row.original, rowIndex)
                return (
                  <TableRow
                    key={row.id}
                    ref={active ? activeRowRef : undefined}
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={() => onRowClick?.(row.original)}
                    style={resolvedRowStyle}
                    className={cn(
                      onRowClick && 'cursor-pointer',
                      active && STICKY_ROW_CLASS,
                      resolvedRowClassName
                    )}
                    isActive={active}
                  >
                    {row.getVisibleCells().map(cell => {
                      const meta = cell.column.columnDef.meta as
                        | { tdClassName?: string }
                        | undefined
                      return (
                        <TableCell key={cell.id} className={meta?.tdClassName}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}

              {isFetchingMore &&
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={`loading-more-${index}`}>
                    {columns.map((_, cellIndex) => (
                      <TableCell key={`loading-cell-${index}-${cellIndex}`}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {sentinelRef && (
                <TableRow
                  aria-hidden="true"
                  className="border-0 hover:bg-transparent"
                >
                  <TableCell colSpan={columns.length} className="h-px p-0">
                    <div ref={sentinelRef} />
                  </TableCell>
                </TableRow>
              )}
            </>
          ) : showNoRecords ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-text-primary h-24 text-center text-sm"
              >
                {noRecordTitle && <p>{noRecordTitle}</p>}
                {noRecordDescription && (
                  <p className="text-text-secondary text-sm">
                    {noRecordDescription}
                  </p>
                )}
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>

        {stickyData && stickyPosition === 'bottom' && (
          <TableFooter className="sticky bottom-0.5 z-10">
            <TableRow className={STICKY_ROW_CLASS}>
              {renderStickyRowCells(stickyData)}
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  )
}
