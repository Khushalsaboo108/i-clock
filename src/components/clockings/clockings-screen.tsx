"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FilterBar } from "@/components/clockings/filter-bar"
import { ClockingsTable } from "@/components/clockings/clockings-table"
import { PaginationBar } from "@/components/clockings/pagination-bar"
import { EditPanel } from "@/components/clockings/edit-panel"
import { BulkEditModal } from "@/components/clockings/bulk-edit-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, AlertCircle, CalendarOff, Users } from "lucide-react"
import { getEmployeeByIdAction, type Employee } from "@/lib/actions/employee.actions"

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
  const router = useRouter()
  const searchParams = useSearchParams()
  const employeeId = searchParams.get("employeeId")

  const [data, setData] = useState<ClockingRecord[]>(INITIAL_DATA)
  const [employeeData, setEmployeeData] = useState<Employee | null>(null)
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<ClockingRecord | null>(null)
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isBulkEditMode, setIsBulkEditMode] = useState(false)
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
  const [bulkAction, setBulkAction] = useState<"clockIn" | "clockOut" | "addHours" | null>(null)

  // Fetch employee details if employeeId is present
  useEffect(() => {
    async function fetchEmployee() {
      if (!employeeId) {
        setEmployeeData(null)
        return
      }

      console.log(`[ClockingsScreen] Fetching employee for ID: ${employeeId}`)
      setIsLoadingEmployee(true)
      try {
        const response = await getEmployeeByIdAction(employeeId)
        console.log(`[ClockingsScreen] API Response:`, response)
        if (response.success && response.data) {
          setEmployeeData(response.data as any)
        }
      } catch (err) {
        console.error("[ClockingsScreen] Error fetching employee:", err)
      } finally {
        setIsLoadingEmployee(false)
      }
    }
    fetchEmployee()
  }, [employeeId])

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

  const handleBackClick = () => {
    router.back()
  }

  // Summary counts (mock data analysis)
  const summary = useMemo(() => {
    return {
      met: data.filter(d => d.status === "Target Met").length,
      issues: data.filter(d => ["Short", "Missing"].includes(d.status)).length,
      absent: data.filter(d => ["Absent", "Paid Leave"].includes(d.status)).length,
      total: data.length
    }
  }, [data])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              className="rounded-full h-8 w-8"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Home</span>
              <span>{">"}</span>
              {employeeData && (
                <>
                  <span>Employees</span>
                  <span>{">"}</span>
                  <span className="font-medium text-foreground">{employeeData.name}</span>
                  <span>{">"}</span>
                </>
              )}
              <span>Clockings</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">
              {employeeData ? `${employeeData.name}'s Clockings` : "Amend T&A Clockings"}
            </h1>
            {employeeData && (
              <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full border border-border/50 uppercase tracking-wider">
                #{employeeData.employee_code || employeeData.employee_id}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1 ml-12">
            Review and edit employee time clockings and calculated hours
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8 w-full space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">Target Met</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <p className="text-3xl font-bold text-green-800 dark:text-green-300">{summary.met}</p>
                    <p className="text-xs text-green-600/70 font-medium">({Math.round(summary.met / summary.total * 100)}%)</p>
                  </div>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Clocking Issues</p>
                  <p className="text-3xl font-bold text-amber-800 dark:text-amber-300 mt-2">{summary.issues}</p>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">Absences/Leaves</p>
                  <p className="text-3xl font-bold text-red-800 dark:text-red-300 mt-2">{summary.absent}</p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                  <CalendarOff className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden border-border shadow-sm">
          {/* Sticky Filter Bar */}
          <div className="bg-card border-b border-border p-4">
            <FilterBar
              onBulkEditToggle={() => setIsBulkEditMode(!isBulkEditMode)}
              isBulkEditMode={isBulkEditMode}
              selectedCount={selectedRows.length}
              onBulkAction={handleBulkAction}
            />
          </div>

          <div className="p-0">
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
          </div>
        </Card>
      </div>

      <div className="mt-auto">
        <PaginationBar
          totalRecords={247}
          showingStart={1}
          showingEnd={50}
          summary={{ complete: 180, issues: 45, absent: 22 }}
        />
      </div>

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
    </div>
  )
}
