'use client'

import type * as React from 'react'

import { cn } from '@/lib/utils/style'

interface TableProps extends React.ComponentProps<'table'> {
  tableContainerClassName?: string
  scrollRef?: React.RefObject<HTMLDivElement | null>
}

interface TrProps extends React.ComponentProps<'tr'> {
  isActive?: boolean
}

function Table({
  className,
  tableContainerClassName,
  scrollRef,
  children,
  ...props
}: TableProps) {
  return (
    <div
      ref={scrollRef}
      data-slot="table-container"
      className={cn(
        'relative w-full overflow-x-auto border-[#282828] bg-[#110C13]',
        tableContainerClassName
      )}
    >
      <table
        data-slot="table"
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn('[&_tr]:border-b [&_tr]:border-[#282828]', className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn('border-transparent [&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        'border-t bg-[#312037] font-medium [&>tr]:last:border-b-0',
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, isActive, ...props }: TrProps) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'data-[state=selected]:bg-muted transition-colors hover:bg-[#312037]',
        className,
        isActive && 'bg-[#312037]'
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'text-text-secondary h-10 px-2 text-left align-middle text-xs font-medium whitespace-nowrap md:px-4 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'px-2 py-2 align-middle whitespace-nowrap md:px-4 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  )
}

export {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
}
