"use client"

import { useState } from "react"
import { FilterBar } from "@/components/clockings/filter-bar"
import { ClockingsTable } from "@/components/clockings/clockings-table"
import { PaginationBar } from "@/components/clockings/pagination-bar"
import { EditPanel } from "@/components/clockings/edit-panel"
import { BulkEditModal } from "@/components/clockings/bulk-edit-modal"
import { Toaster } from "@/components/ui/toaster"

// Mock data type definition
export type ClockingRecord = {
  id: string
  employeeId: string
  employeeName: string
  date: string
  clockIn: string[]
  clockOut: string[]
  totalHours: string
  targetHours: string
  status: "Target Met" | "Short" | "Missing" | "Absent" | "Paid Leave"
  isOverride: boolean
  notes?: string
}

// Mock data
const INITIAL_DATA: ClockingRecord[] = [
  {
    id: "1",
    employeeId: "EMP-001",
    employeeName: "John Smith",
    date: "2024-11-01",
    clockIn: ["08:00"],
    clockOut: ["17:00"],
    totalHours: "8h 00m",
    targetHours: "8h 00m",
    status: "Target Met",
    isOverride: false,
  },
  {
    id: "2",
    employeeId: "EMP-001",
    employeeName: "John Smith",
    date: "2024-11-02",
    clockIn: ["08:15"],
    clockOut: ["16:45"],
    totalHours: "7h 30m",
    targetHours: "8h 00m",
    status: "Short",
    isOverride: false,
  },
  {
    id: "3",
    employeeId: "EMP-002",
    employeeName: "Sarah Johnson",
    date: "2024-11-01",
    clockIn: ["09:00"],
    clockOut: [],
    totalHours: "0h 00m",
    targetHours: "8h 00m",
    status: "Missing",
    isOverride: false,
  },
  {
    id: "4",
    employeeId: "EMP-003",
    employeeName: "Michael Chen",
    date: "2024-11-01",
    clockIn: [],
    clockOut: [],
    totalHours: "0h 00m",
    targetHours: "8h 00m",
    status: "Absent",
    isOverride: false,
  },
  {
    id: "5",
    employeeId: "EMP-004",
    employeeName: "Emily Rodriguez",
    date: "2024-11-01",
    clockIn: [],
    clockOut: [],
    totalHours: "8h 00m",
    targetHours: "8h 00m",
    status: "Paid Leave",
    isOverride: false,
    notes: "Annual Leave",
  },
  {
    id: "6",
    employeeId: "EMP-005",
    employeeName: "David Lee",
    date: "2024-11-03",
    clockIn: ["08:00", "13:00"],
    clockOut: ["12:00", "17:30"],
    totalHours: "8h 30m",
    targetHours: "8h 00m",
    status: "Target Met",
    isOverride: false,
  },
]

export function ClockingsScreen() {
  const [data, setData] = useState<ClockingRecord[]>(INITIAL_DATA)
  const [selectedRecord, setSelectedRecord] = useState<ClockingRecord | null>(null)
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isBulkEditMode, setIsBulkEditMode] = useState(false)
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
  const [bulkAction, setBulkAction] = useState<"clockIn" | "clockOut" | "addHours" | null>(null)

  const handleEdit = (record: ClockingRecord) => {
    setSelectedRecord(record)
    setIsEditPanelOpen(true)
  }

  const handleClosePanel = () => {
    setIsEditPanelOpen(false)
    setSelectedRecord(null)
  }

  const handleBulkAction = (action: "clockIn" | "clockOut" | "addHours") => {
    setBulkAction(action)
    setIsBulkModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-5">
        <h1 className="text-2xl font-semibold text-gray-900">Amend T&A Clockings</h1>
        <p className="text-sm text-gray-500 mt-1">Review and edit employee time clockings and calculated hours</p>
      </header>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <FilterBar
          onBulkEditToggle={() => setIsBulkEditMode(!isBulkEditMode)}
          isBulkEditMode={isBulkEditMode}
          selectedCount={selectedRows.length}
          onBulkAction={handleBulkAction}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <ClockingsTable
          data={data}
          onEdit={handleEdit}
          isBulkEditMode={isBulkEditMode}
          selectedRows={selectedRows}
          onSelectRow={(id) => {
            if (selectedRows.includes(id)) {
              setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
            } else {
              setSelectedRows([...selectedRows, id])
            }
          }}
          onSelectAll={(checked) => {
            if (checked) {
              setSelectedRows(data.map((d) => d.id))
            } else {
              setSelectedRows([])
            }
          }}
        />
      </main>

      {/* Footer */}
      <PaginationBar
        totalRecords={247}
        showingStart={1}
        showingEnd={50}
        summary={{ complete: 180, issues: 45, absent: 22 }}
      />

      {/* Slide-out Edit Panel */}
      <EditPanel isOpen={isEditPanelOpen} onClose={handleClosePanel} record={selectedRecord} />

      {/* Bulk Edit Modal */}
      <BulkEditModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        selectedCount={selectedRows.length}
        action={bulkAction}
        selectedEmployees={data.filter((d) => selectedRows.includes(d.id))}
      />

      <Toaster />
    </div>
  )
}
