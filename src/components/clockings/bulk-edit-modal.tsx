"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ClockingRecord } from "@/components/clockings/clockings-screen"
import { format } from "date-fns"
import { Clock, Timer, Users } from "lucide-react"

interface BulkEditModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCount: number
  action: "clockIn" | "clockOut" | "clockBoth" | "missingOut" | "addHours" | "deductHours" | "bulkFilter" | null
  selectedEmployees: ClockingRecord[]
}

const columnOptions = ["Normal", "Overtime", "Double-Time", "Night", "Holiday", "Sick", "Leave"]
const filterOptions = ["Department", "Location", "Shift Type", "Cost Center", "Team"]

export function BulkEditModal({ isOpen, onClose, selectedCount, action: initialAction, selectedEmployees }: BulkEditModalProps) {
  const [activeTab, setActiveTab] = useState<"clockings" | "hours" | "filters">("clockings")
  const [clockingAction, setClockingAction] = useState<"clockIn" | "clockOut" | "clockBoth" | "missingOut">(
    initialAction === "clockIn" || initialAction === "clockOut" || initialAction === "clockBoth" || initialAction === "missingOut"
      ? initialAction
      : "clockIn"
  )
  const [hoursAction, setHoursAction] = useState<"add" | "deduct">(initialAction === "deductHours" ? "deduct" : "add")

  // Clocking fields
  const [clockInTime, setClockInTime] = useState("08:00")
  const [clockOutTime, setClockOutTime] = useState("17:00")
  const [applyNonCompulsory, setApplyNonCompulsory] = useState(false)

  // Hours fields
  const [hoursAmount, setHoursAmount] = useState(0)
  const [minutesAmount, setMinutesAmount] = useState(0)
  const [selectedColumn, setSelectedColumn] = useState("Normal")

  // Filter fields
  const [selectedFilter, setSelectedFilter] = useState("Department")
  const [filterValue, setFilterValue] = useState("")

  // Date range
  const [useDateRange, setUseDateRange] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Notes
  const [notes, setNotes] = useState("")

  const getActionDescription = () => {
    if (activeTab === "clockings") {
      switch (clockingAction) {
        case "clockIn": return "Add Clock IN"
        case "clockOut": return "Add Clock OUT"
        case "clockBoth": return "Add Clock IN & OUT"
        case "missingOut": return "Add Missing OUT Only"
      }
    } else if (activeTab === "hours") {
      return hoursAction === "add" ? "Add Hours" : "Deduct Hours"
    } else {
      return "Update Employee Filters"
    }
  }

  const handleApply = () => {
    // In a real app, this would call the API
    console.log({
      activeTab,
      clockingAction: activeTab === "clockings" ? clockingAction : null,
      hoursAction: activeTab === "hours" ? hoursAction : null,
      clockInTime,
      clockOutTime,
      applyNonCompulsory,
      hoursAmount,
      minutesAmount,
      selectedColumn,
      selectedFilter,
      filterValue,
      useDateRange,
      startDate,
      endDate,
      notes,
      selectedEmployees: selectedEmployees.map(e => e.id),
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Edit - {getActionDescription()}</DialogTitle>
          <DialogDescription>Applying changes to {selectedCount} selected records.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="clockings" className="gap-2">
              <Clock className="w-4 h-4" />
              Clockings
            </TabsTrigger>
            <TabsTrigger value="hours" className="gap-2">
              <Timer className="w-4 h-4" />
              Hours
            </TabsTrigger>
            <TabsTrigger value="filters" className="gap-2">
              <Users className="w-4 h-4" />
              Filters
            </TabsTrigger>
          </TabsList>

          {/* Clockings Tab */}
          <TabsContent value="clockings" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Clocking Action</Label>
              <Select value={clockingAction} onValueChange={(v: typeof clockingAction) => setClockingAction(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clockIn">Add IN</SelectItem>
                  <SelectItem value="clockOut">Add OUT</SelectItem>
                  <SelectItem value="clockBoth">Add IN & OUT</SelectItem>
                  <SelectItem value="missingOut">Add Only Missing OUT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(clockingAction === "clockIn" || clockingAction === "clockBoth") && (
              <div className="space-y-2">
                <Label>Clock IN Time</Label>
                <Input
                  type="time"
                  value={clockInTime}
                  onChange={(e) => setClockInTime(e.target.value)}
                  className="font-mono w-[150px]"
                />
              </div>
            )}

            {(clockingAction === "clockOut" || clockingAction === "clockBoth" || clockingAction === "missingOut") && (
              <div className="space-y-2">
                <Label>Clock OUT Time</Label>
                <Input
                  type="time"
                  value={clockOutTime}
                  onChange={(e) => setClockOutTime(e.target.value)}
                  className="font-mono w-[150px]"
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="non-compulsory"
                checked={applyNonCompulsory}
                onCheckedChange={(v) => setApplyNonCompulsory(v === true)}
              />
              <Label htmlFor="non-compulsory" className="font-normal text-sm">
                Apply to non-compulsory days
              </Label>
            </div>
          </TabsContent>

          {/* Hours Tab */}
          <TabsContent value="hours" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Action</Label>
              <Select value={hoursAction} onValueChange={(v: "add" | "deduct") => setHoursAction(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add Hours</SelectItem>
                  <SelectItem value="deduct">Deduct Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hours</Label>
                <Input
                  type="number"
                  min={0}
                  value={hoursAmount}
                  onChange={(e) => setHoursAmount(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Minutes</Label>
                <Input
                  type="number"
                  min={0}
                  max={59}
                  value={minutesAmount}
                  onChange={(e) => setMinutesAmount(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Column (Payrate)</Label>
              <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {columnOptions.map((col) => (
                    <SelectItem key={col} value={col}>{col}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {hoursAction === "add" ? "Hours will be added to this column" : "Hours will be deducted from this column"}
              </p>
            </div>
          </TabsContent>

          {/* Filters Tab */}
          <TabsContent value="filters" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Filter to Change</Label>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.map((filter) => (
                    <SelectItem key={filter} value={filter}>{filter}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>New Value</Label>
              <Input
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                placeholder={`Enter new ${selectedFilter.toLowerCase()}...`}
              />
            </div>

            <p className="text-sm text-muted-foreground">
              This will update the <strong>{selectedFilter}</strong> field for all {selectedCount} selected employees.
            </p>
          </TabsContent>
        </Tabs>

        {/* Date Range Section */}
        <div className="border-t border-gray-100 pt-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="use-date-range"
              checked={useDateRange}
              onCheckedChange={(v) => setUseDateRange(v === true)}
            />
            <Label htmlFor="use-date-range" className="font-normal text-sm">
              Apply to date range
            </Label>
          </div>

          {useDateRange && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Selected Employees Preview */}
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200 max-h-[100px] overflow-y-auto">
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Selected Employees:</p>
          <div className="flex flex-wrap gap-1">
            {selectedEmployees.slice(0, 10).map((emp) => (
              <Badge key={emp.id} variant="secondary" className="text-xs">
                {emp.employeeName}
              </Badge>
            ))}
            {selectedEmployees.length > 10 && (
              <Badge variant="outline" className="text-xs">
                +{selectedEmployees.length - 10} more
              </Badge>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Reason for bulk edit..."
            className="resize-none"
            rows={2}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApply} className="bg-blue-600 hover:bg-blue-700">
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
