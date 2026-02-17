"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Edit2, Eye, ArrowUpDown } from "lucide-react"
import type { ClockingRecord } from "@/components/clockings/clockings-screen"
import { format } from "date-fns"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table"

interface ClockingsTableProps {
  data: ClockingRecord[]
  onEdit: (record: ClockingRecord) => void
  isBulkEditMode: boolean
  selectedRows: string[]
  onSelectRow: (id: string) => void
  onSelectAll: (checked: boolean) => void
}

export function ClockingsTable({
  data,
  onEdit,
  isBulkEditMode,
  selectedRows,
  onSelectRow,
  onSelectAll,
}: ClockingsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const getStatusColor = (status: ClockingRecord["status"]) => {
    switch (status) {
      case "Target Met":
      case "Paid Leave":
        return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
      case "Short":
      case "Missing":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
      case "Absent":
        return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
    }
  }

  const getStatusIcon = (status: ClockingRecord["status"]) => {
    switch (status) {
      case "Target Met":
      case "Paid Leave":
        return "✅"
      case "Short":
      case "Missing":
        return "⚠️"
      case "Absent":
        return "🔴"
      default:
        return ""
    }
  }

  const getRowBackground = (status: ClockingRecord["status"]) => {
    switch (status) {
      case "Target Met":
      case "Paid Leave":
        return "bg-[#D1FAE5]/30 hover:bg-[#D1FAE5]/50 dark:bg-green-900/10 dark:hover:bg-green-900/20"
      case "Short":
      case "Missing":
        return "bg-[#FEF3C7]/30 hover:bg-[#FEF3C7]/50 dark:bg-amber-900/10 dark:hover:bg-amber-900/20"
      case "Absent":
        return "bg-[#FEE2E2]/30 hover:bg-[#FEE2E2]/50 dark:bg-red-900/10 dark:hover:bg-red-900/20"
      default:
        return "hover:bg-muted/50"
    }
  }

  const columns = useMemo<ColumnDef<ClockingRecord>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          isBulkEditMode ? (
            <TableHead className="w-[50px]">
              <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => {
                  table.toggleAllPageRowsSelected(!!value)
                  onSelectAll(!!value)
                }}
              />
            </TableHead>
          ) : null
        ),
        cell: ({ row }) => (
          isBulkEditMode ? (
            <TableCell>
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => {
                  row.toggleSelected(!!value)
                  onSelectRow(row.original.id)
                }}
              />
            </TableCell>
          ) : null
        ),
        enableSorting: false,
      },
      {
        accessorKey: "employeeId",
        header: () => <TableHead className="w-[120px] font-semibold text-muted-foreground uppercase text-[13px]">Employee #</TableHead>,
        cell: ({ row }) => <TableCell className="font-mono text-muted-foreground font-medium">{row.getValue("employeeId")}</TableCell>,
      },
      {
        accessorKey: "employeeName",
        header: ({ column }) => (
          <TableHead className="w-[200px] font-semibold text-muted-foreground uppercase text-[13px]">
            <div
              className="flex items-center gap-1 cursor-pointer hover:text-foreground"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Employee Name
              <ArrowUpDown className="h-3 w-3" />
            </div>
          </TableHead>
        ),
        cell: ({ row }) => <TableCell className="font-medium text-foreground">{row.getValue("employeeName")}</TableCell>,
      },
      {
        accessorKey: "date",
        header: ({ column }) => (
          <TableHead className="w-[120px] font-semibold text-muted-foreground uppercase text-[13px] text-center">
            <div
              className="flex items-center justify-center gap-1 cursor-pointer hover:text-foreground"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Date
              <ArrowUpDown className="h-3 w-3" />
            </div>
          </TableHead>
        ),
        cell: ({ row }) => (
          <TableCell className="text-center text-muted-foreground">
            {format(new Date(row.getValue("date")), "dd/MM/yyyy")}
          </TableCell>
        ),
      },
      {
        accessorKey: "clockIn",
        header: () => <TableHead className="w-[120px] font-semibold text-muted-foreground uppercase text-[13px] text-center">Clock IN</TableHead>,
        cell: ({ row }) => {
          const record = row.original
          return (
            <TableCell className="text-center">
              {record.status === "Paid Leave" ? (
                <span className="text-sm font-medium text-green-600 italic">{record.notes || "Paid Leave"}</span>
              ) : record.status === "Absent" ? (
                <span className="text-gray-400 font-mono">--:--</span>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  {record.clockIn.length > 0 ? (
                    record.clockIn.map((time, i) => (
                      <span
                        key={i}
                        className="font-mono text-foreground bg-background/50 px-1 rounded hover:bg-background cursor-pointer group flex items-center gap-1"
                      >
                        {time}
                        <Edit2 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 font-mono">--:--</span>
                  )}
                </div>
              )}
            </TableCell>
          )
        },
      },
      {
        accessorKey: "clockOut",
        header: () => <TableHead className="w-[120px] font-semibold text-muted-foreground uppercase text-[13px] text-center">Clock OUT</TableHead>,
        cell: ({ row }) => {
          const record = row.original
          return (
            <TableCell className="text-center">
              {record.status === "Paid Leave" ? (
                <span className="text-sm text-gray-400">-</span>
              ) : record.status === "Absent" ? (
                <span className="text-gray-400 font-mono">--:--</span>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  {record.clockOut.length > 0 ? (
                    record.clockOut.map((time, i) => (
                      <span
                        key={i}
                        className="font-mono text-foreground bg-background/50 px-1 rounded hover:bg-background cursor-pointer group flex items-center gap-1"
                      >
                        {time}
                        <Edit2 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 font-mono">--:--</span>
                  )}
                </div>
              )}
            </TableCell>
          )
        },
      },
      {
        accessorKey: "totalHours",
        header: () => <TableHead className="w-[140px] font-semibold text-muted-foreground uppercase text-[13px] text-center">Total Hours</TableHead>,
        cell: ({ row }) => {
          const record = row.original
          return (
            <TableCell className="text-center">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "font-mono font-medium",
                    record.status === "Target Met" || record.status === "Paid Leave"
                      ? "font-bold text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {record.totalHours}
                </span>
                <span className="text-[10px] text-gray-500 uppercase">
                  {record.isOverride ? "(Override)" : "(Calculated)"}
                </span>
              </div>
            </TableCell>
          )
        },
      },
      {
        accessorKey: "status",
        header: () => <TableHead className="w-[160px] font-semibold text-muted-foreground uppercase text-[13px] text-center">Status</TableHead>,
        cell: ({ row }) => (
          <TableCell className="text-center">
            <Badge
              variant="outline"
              className={cn("font-medium px-2 py-0.5 whitespace-nowrap", getStatusColor(row.getValue("status")))}
            >
              <span className="mr-1.5">{getStatusIcon(row.getValue("status"))}</span>
              {row.getValue("status")}
            </Badge>
          </TableCell>
        ),
      },
      {
        id: "actions",
        header: () => <TableHead className="w-[100px] font-semibold text-muted-foreground uppercase text-[13px] text-center">Actions</TableHead>,
        cell: ({ row }) => (
          <TableCell className="text-center">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              onClick={() => onEdit(row.original)}
            >
              {row.original.status === "Paid Leave" ? <Eye className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
            </Button>
          </TableCell>
        )
      }
    ],
    [isBulkEditMode, onSelectAll, onSelectRow, onEdit]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection: Object.fromEntries(selectedRows.map(id => [data.findIndex(d => d.id === id), true]))
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
  })

  return (
    <div className="rounded-md border border-border overflow-hidden shadow-sm bg-card">
      <Table>
        <TableHeader className="bg-muted/40 sticky top-0 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b-2 border-border hover:bg-muted/40">
              {headerGroup.headers.map((header) => {
                // Hacky way to inject the Header component which is a TableHead
                // because TanStack usually expects the renderer to handle wrapping.
                // Here colDef.header is a function that returns TableHead.
                // We need to be careful with double wrapping.
                const content = flexRender(header.column.columnDef.header, header.getContext())
                return content ? <React.Fragment key={header.id}>{content}</React.Fragment> : null
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={cn(
                  "h-[60px] transition-colors border-b border-border",
                  getRowBackground(row.original.status),
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <React.Fragment key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </React.Fragment>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={isBulkEditMode ? 9 : 8} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
