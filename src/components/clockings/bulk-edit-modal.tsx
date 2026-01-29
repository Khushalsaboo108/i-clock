"use client"

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
import type { ClockingRecord } from "@/components/clockings/clockings-screen"
import { format } from "date-fns"

interface BulkEditModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCount: number
  action: "clockIn" | "clockOut" | "addHours" | null
  selectedEmployees: ClockingRecord[]
}

export function BulkEditModal({ isOpen, onClose, selectedCount, action, selectedEmployees }: BulkEditModalProps) {
  const getTitle = () => {
    switch (action) {
      case "clockIn":
        return "Bulk Add Clock IN"
      case "clockOut":
        return "Bulk Add Clock OUT"
      case "addHours":
        return "Bulk Add Hours"
      default:
        return "Bulk Edit"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>Applying changes to {selectedCount} selected records.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200 max-h-[120px] overflow-y-auto">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Selected Employees:</p>
            <ul className="space-y-1">
              {selectedEmployees.map((emp) => (
                <li key={emp.id} className="text-sm text-gray-700 flex justify-between">
                  <span>
                    {emp.employeeName} ({emp.employeeId})
                  </span>
                  <span className="text-gray-500">{format(new Date(emp.date), "dd/MM/yyyy")}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-4">
            {(action === "clockIn" || action === "clockOut") && (
              <div className="space-y-2">
                <Label>Time</Label>
                <Input type="time" className="font-mono w-[150px]" defaultValue="08:00" />
              </div>
            )}

            {action === "addHours" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hours</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Minutes</Label>
                  <Input type="number" placeholder="0" />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox id="non-compulsory" />
              <Label htmlFor="non-compulsory" className="font-normal text-sm">
                Apply to non-compulsory days
              </Label>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Reason for bulk edit..." className="resize-none" />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Apply Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
