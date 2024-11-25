import { useTranslation } from 'react-i18next'
import React, { Dispatch, SetStateAction, useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  VisibilityState,
  useReactTable,
  Column,
  Table as ReactTable,
} from '@tanstack/react-table'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2Icon,
  SearchIcon,
} from 'lucide-react'
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  MixerHorizontalIcon,
} from '@radix-ui/react-icons'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Input,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from '@/components/ui'
import { cn } from '@/lib/utils'

interface DataTablePaginationProps<TData> {
  table: ReactTable<TData>
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export interface DataTableFilterOptionsProps<TData> {
  setFilterOption: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
  data: TData[]
}

// DataTableColumnHeader Component
interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export interface DataTableActionOptionsProps<TData> {
  table: ReactTable<TData>
}

interface DataTableViewOptionsProps<TData> {
  table: ReactTable<TData>
}

// DataTable Component
interface DataTableProps<TData, TValue> {
  isLoading: boolean
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pages: number
  inputValue?: string
  hiddenInput?: boolean
  onPageChange: (pageIndex: number) => void
  onPageSizeChange: (pageSize: number) => void
  onRowClick?: (row: TData) => void
  onInputChange?: Dispatch<SetStateAction<string>>
  filterOptions?: React.FC<DataTableFilterOptionsProps<TData>>
  actionOptions?: React.FC<DataTableActionOptionsProps<TData>>
}

export function DataTable<TData, TValue>({
  isLoading,
  columns,
  data,
  pages,
  inputValue,
  hiddenInput = true,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  onInputChange,
  filterOptions: DataTableFilterOptions,
  actionOptions: DataTableActionOptions,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation('common')

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    pageCount: pages,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    debugTable: true,
  })

  return (
    <div className="w-full">
      <div className="flex justify-end gap-2">
        {/* Input search */}
        {!hiddenInput && (
          <div className="relative max-w-sm">
            <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder={t('tableData.search')}
              value={inputValue}
              onChange={(e) => {
                onInputChange?.(e.target.value)
              }}
              className="border placeholder:hidden sm:h-auto sm:w-full sm:pl-8 sm:pr-2 placeholder:sm:inline md:w-auto"
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          {/* Actions */}
          {DataTableActionOptions && <DataTableActionOptions table={table} />}
          {/* Filter */}
          {DataTableFilterOptions && (
            <DataTableFilterOptions
              setFilterOption={setColumnFilters}
              data={data}
            />
          )}
          {/* View options */}
          <DataTableViewOptions table={table} />
        </div>
      </div>

      {/* Table */}
      <div className="mt-3 rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="mx-auto h-full w-full text-center"
                >
                  <Loader2Icon className="mx-auto h-6 w-6 animate-spin text-primary" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={
                    row.getIsSelected() ? t('tablePaging.selected') : undefined
                  }
                  className="relative cursor-pointer hover:bg-muted/50"
                  onClick={() => onRowClick && onRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-full text-center"
                >
                  {t('common.noData')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <DataTablePagination
          table={table}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  )
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const { t } = useTranslation('tableData')

  if (!column.getCanSort()) {
    return <div className="text-[0.8rem]">{title}</div>
  }

  return (
    <div
      className={cn(
        'flex min-w-[6rem] items-center space-x-2 text-[0.8rem]',
        className,
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span className="text-[0.8rem]">{t(title)}</span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className="ml-2 h-3 w-3" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className="ml-2 h-3 w-3" />
            ) : (
              <ArrowDownIcon className="ml-2 h-3 w-3" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUpIcon className="mr-2 h-3 w-3 text-muted-foreground/70" />
            {t('tablePaging.asc')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDownIcon className="mr-2 h-3 w-3 text-muted-foreground/70" />
            {t('tablePaging.desc')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <ArrowUpIcon className="mr-2 h-3 w-3 text-muted-foreground/70" />
            {t('tablePaging.hide')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function DataTableColumnAddressHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const { t } = useTranslation('tableData')
  if (!column.getCanSort()) {
    return <div className="text-[0.8rem]">{title}</div>
  }

  return (
    <div
      className={cn(
        'flex min-w-[12rem] items-center space-x-2 text-[0.8rem]',
        className,
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span className="text-[0.8rem]">{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className="ml-2 h-3 w-3" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className="ml-2 h-3 w-3" />
            ) : (
              <ArrowDownIcon className="ml-2 h-3 w-3" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUpIcon className="mr-2 h-3 w-3 text-muted-foreground/70" />
            {t('tablePaging.asc')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDownIcon className="mr-2 h-3 w-3 text-muted-foreground/70" />
            {t('tablePaging.desc')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <ArrowUpIcon className="mr-2 h-3 w-3 text-muted-foreground/70" />
            {t('tablePaging.hide')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function DataTableColumnActionHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const { t } = useTranslation('tableData')
  if (!column.getCanSort()) {
    return <div className="text-[0.8rem]">{title}</div>
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center space-x-2 text-[0.8rem]',
        className,
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span className="text-[0.8rem]">{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className="ml-2 h-3 w-3" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className="ml-2 h-3 w-3" />
            ) : (
              <ArrowDownIcon className="ml-2 h-3 w-3" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUpIcon className="mr-2 h-3 w-3 text-muted-foreground/70" />
            {t('tablePaging.asc')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDownIcon className="mr-2 h-3 w-3 text-muted-foreground/70" />
            {t('tablePaging.desc')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <ArrowUpIcon className="mr-2 h-3 w-3 text-muted-foreground/70" />
            {t('tablePaging.hide')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function DataTablePagination<TData>({
  table,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex flex-wrap items-center justify-between px-2">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="sr-only text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
              onPageSizeChange?.(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="sr-only flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              table.setPageIndex(0)
              onPageChange?.(1)
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              onPageChange(table.getState().pagination.pageIndex)
              table.previousPage()
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              onPageChange(table.getState().pagination.pageIndex + 2)
              table.nextPage()
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              onPageChange(table.getPageCount())
              table.setPageIndex(table.getPageCount() - 1)
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-10 items-center gap-1 lg:flex"
        >
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          Hiển thị
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Hiện thị cột</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== 'undefined' && column.getCanHide(),
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="cursor-pointer capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
