"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { X, Clock, Trash2, Plus } from "lucide-react"
import type { ClockingRecord } from "@/components/clockings-screen"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface EditPanelProps {
  isOpen: boolean
  onClose: () => void
  record: ClockingRecord | null
}

export function EditPanel({ isOpen, onClose, record }: EditPanelProps) {
  if (!isOpen || !record) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40 transition-opacity" onClick={onClose} />

      {/* Slide-in Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Edit Time Record</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Employee Info */}
          <div>
            <div className="text-base font-bold text-gray-900">
              {record.employeeName} <span className="text-gray-500 font-normal">({record.employeeId})</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">{format(new Date(record.date), "MMMM d, yyyy")}</div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Clockings Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Clockings</h3>

            {/* Clock INs */}
            <div className="space-y-3">
              {record.clockIn.map((time, index) => (
                <div key={`in-${index}`} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500 w-20">Clock IN {index + 1}</span>
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded px-2 py-1">
                      <Clock className="h-3.5 w-3.5 text-gray-400 mr-2" />
                      <span className="font-mono text-sm font-medium">{time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 hover:text-blue-700">
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="link" className="px-0 text-blue-600 h-auto font-medium text-sm hover:no-underline">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Clock IN
              </Button>
            </div>

            {/* Clock OUTs */}
            <div className="space-y-3 pt-2">
              {record.clockOut.map((time, index) => (
                <div key={`out-${index}`} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500 w-20">Clock OUT {index + 1}</span>
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded px-2 py-1">
                      <Clock className="h-3.5 w-3.5 text-gray-400 mr-2" />
                      <span className="font-mono text-sm font-medium">{time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 hover:text-blue-700">
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="link" className="px-0 text-blue-600 h-auto font-medium text-sm hover:no-underline">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Clock OUT
              </Button>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Override Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Override Hours</h3>
              <div className="flex items-center space-x-2">
                <Checkbox id="override" />
                <Label htmlFor="override" className="text-sm font-normal">
                  Override calculated hours
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Hours</Label>
                <Input type="number" placeholder="0" className="font-mono" disabled />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Minutes</Label>
                <Input type="number" placeholder="0" className="font-mono" disabled />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-gray-500">Reason for Override</Label>
              <Textarea
                placeholder="Enter reason for manual override..."
                className="resize-none min-h-[80px]"
                disabled
              />
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Summary Box */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Calculated Total:</span>
              <span className="font-mono font-medium text-gray-900">{record.totalHours}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Target Hours:</span>
              <span className="font-mono font-medium text-gray-900">{record.targetHours}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between text-sm">
              <span className="font-medium text-gray-900">Difference:</span>
              <span
                className={cn(
                  "font-mono font-bold",
                  record.status === "Short" || record.status === "Missing"
                    ? "text-amber-600"
                    : record.status === "Absent"
                      ? "text-red-600"
                      : "text-green-600",
                )}
              >
                {record.status === "Target Met" ? "+0h 00m" : "-0h 30m"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Save Changes</Button>
        </div>
      </div>
    </>
  )
}
