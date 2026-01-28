"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Edit2, Eye, ArrowUpDown } from "lucide-react"
import type { ClockingRecord } from "@/components/clockings-screen"
import { format } from "date-fns"

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
  const getStatusColor = (status: ClockingRecord["status"]) => {
    switch (status) {
      case "Target Met":
      case "Paid Leave":
        return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
      case "Short":
      case "Missing":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200"
      case "Absent":
        return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
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
        return "bg-[#D1FAE5]/30 hover:bg-[#D1FAE5]/50"
      case "Short":
      case "Missing":
        return "bg-[#FEF3C7]/30 hover:bg-[#FEF3C7]/50"
      case "Absent":
        return "bg-[#FEE2E2]/30 hover:bg-[#FEE2E2]/50"
      default:
        return "hover:bg-[#F0F9FF]"
    }
  }

  return (
    <div className="rounded-md border border-gray-200 overflow-hidden shadow-sm bg-white">
      <Table>
        <TableHeader className="bg-gray-50 sticky top-0 z-10">
          <TableRow className="border-b-2 border-gray-200 hover:bg-gray-50">
            {isBulkEditMode && (
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={data.length > 0 && selectedRows.length === data.length}
                  onCheckedChange={(checked) => onSelectAll(!!checked)}
                />
              </TableHead>
            )}
            <TableHead className="w-[120px] font-semibold text-gray-700 uppercase text-[13px]">Employee #</TableHead>
            <TableHead className="w-[200px] font-semibold text-gray-700 uppercase text-[13px]">
              <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                Employee Name
                <ArrowUpDown className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead className="w-[120px] font-semibold text-gray-700 uppercase text-[13px] text-center">
              <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-gray-900">
                Date
                <ArrowUpDown className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead className="w-[120px] font-semibold text-gray-700 uppercase text-[13px] text-center">
              Clock IN
            </TableHead>
            <TableHead className="w-[120px] font-semibold text-gray-700 uppercase text-[13px] text-center">
              Clock OUT
            </TableHead>
            <TableHead className="w-[140px] font-semibold text-gray-700 uppercase text-[13px] text-center">
              Total Hours
            </TableHead>
            <TableHead className="w-[160px] font-semibold text-gray-700 uppercase text-[13px] text-center">
              Status
            </TableHead>
            <TableHead className="w-[100px] font-semibold text-gray-700 uppercase text-[13px] text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record, index) => (
            <TableRow
              key={record.id}
              className={cn(
                "h-[60px] transition-colors border-b border-gray-100",
                getRowBackground(record.status),
                index % 2 === 1 && record.status === "Target Met" ? "" : "", // Alternating logic overridden by status colors
                index % 2 === 1 && !["Target Met", "Paid Leave", "Short", "Missing", "Absent"].includes(record.status)
                  ? "bg-[#F9FAFB]"
                  : "",
              )}
            >
              {isBulkEditMode && (
                <TableCell>
                  <Checkbox checked={selectedRows.includes(record.id)} onCheckedChange={() => onSelectRow(record.id)} />
                </TableCell>
              )}
              <TableCell className="font-mono text-gray-600 font-medium">{record.employeeId}</TableCell>
              <TableCell className="font-medium text-gray-900">{record.employeeName}</TableCell>
              <TableCell className="text-center text-gray-600">{format(new Date(record.date), "dd/MM/yyyy")}</TableCell>

              {/* Clock IN Column */}
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
                          className="font-mono text-gray-900 bg-white/50 px-1 rounded hover:bg-white cursor-pointer group flex items-center gap-1"
                        >
                          {time}
                          <Edit2 className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100" />
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 font-mono">--:--</span>
                    )}
                  </div>
                )}
              </TableCell>

              {/* Clock OUT Column */}
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
                          className="font-mono text-gray-900 bg-white/50 px-1 rounded hover:bg-white cursor-pointer group flex items-center gap-1"
                        >
                          {time}
                          <Edit2 className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100" />
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 font-mono">--:--</span>
                    )}
                  </div>
                )}
              </TableCell>

              <TableCell className="text-center">
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "font-mono font-medium",
                      record.status === "Target Met" || record.status === "Paid Leave"
                        ? "font-bold text-gray-900"
                        : "text-gray-700",
                    )}
                  >
                    {record.totalHours}
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase">
                    {record.isOverride ? "(Override)" : "(Calculated)"}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-center">
                <Badge
                  variant="outline"
                  className={cn("font-medium px-2 py-0.5 whitespace-nowrap", getStatusColor(record.status))}
                >
                  <span className="mr-1.5">{getStatusIcon(record.status)}</span>
                  {record.status}
                </Badge>
              </TableCell>

              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                  onClick={() => onEdit(record)}
                >
                  {record.status === "Paid Leave" ? <Eye className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
