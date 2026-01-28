"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Search, ChevronDown, FileSpreadsheet, Printer } from "lucide-react"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FilterBarProps {
  onBulkEditToggle: () => void
  isBulkEditMode: boolean
  selectedCount: number
  onBulkAction: (action: "clockIn" | "clockOut" | "addHours") => void
}

export function FilterBar({ onBulkEditToggle, isBulkEditMode, selectedCount, onBulkAction }: FilterBarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  if (isBulkEditMode && selectedCount > 0) {
    return (
      <div className="px-8 py-4 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-medium text-blue-900">{selectedCount} rows selected</span>
          <div className="h-6 w-px bg-blue-200" />
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={() => onBulkAction("clockIn")}
            >
              Add Clock IN
            </Button>
            <Button
              variant="outline"
              className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={() => onBulkAction("clockOut")}
            >
              Add Clock OUT
            </Button>
            <Button
              variant="outline"
              className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={() => onBulkAction("addHours")}
            >
              Add Hours
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={onBulkEditToggle}
            className="text-blue-700 hover:text-blue-900 hover:bg-blue-100"
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
        {/* Date Range Picker */}
        <div className="flex items-center border border-gray-300 rounded-md bg-white px-3 py-2 shadow-sm w-full md:w-auto">
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-700">01/11/2024 to 30/11/2024</span>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="border-dashed bg-transparent">
                Department
                <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-4" align="start">
              <div className="space-y-4">
                <h4 className="font-medium leading-none">Department</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="dept-eng" defaultChecked />
                    <Label htmlFor="dept-eng">Engineering</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="dept-ops" defaultChecked />
                    <Label htmlFor="dept-ops">Operations</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="dept-sales" />
                    <Label htmlFor="dept-sales">Sales</Label>
                  </div>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    Clear
                  </Button>
                  <Button size="sm" className="h-8 px-2 bg-blue-600 hover:bg-blue-700">
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="border-dashed bg-transparent">
                Location
                <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" align="start">
              <div className="p-4">Location filters...</div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="border-dashed bg-transparent">
                Status
                <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-4" align="start">
              <div className="space-y-4">
                <h4 className="font-medium leading-none">Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="status-target" defaultChecked />
                    <Label htmlFor="status-target">Target Met</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="status-short" defaultChecked />
                    <Label htmlFor="status-short">Short of Target</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="status-absent" defaultChecked />
                    <Label htmlFor="status-absent">Absent</Label>
                  </div>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    Clear
                  </Button>
                  <Button size="sm" className="h-8 px-2 bg-blue-600 hover:bg-blue-700">
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="ghost" size="sm" className="text-blue-600">
            Apply Filters
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
        {/* Search */}
        <div className="relative w-full md:w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search by name or employee #..."
            className="pl-9 bg-gray-50 border-gray-300 focus:bg-white transition-colors"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" title="Export to Excel">
            <FileSpreadsheet className="h-4 w-4 text-gray-600" />
          </Button>
          <Button
            variant={isBulkEditMode ? "secondary" : "outline"}
            onClick={onBulkEditToggle}
            className={cn(isBulkEditMode && "bg-gray-100 border-gray-400")}
          >
            Bulk Edit
          </Button>
          <Button variant="outline" size="icon" title="Print">
            <Printer className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>
    </div>
  )
}
