"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Lock, Plus, X, Info, FileText } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Filter = {
  id: string
  label: string
  value: string
}

export function RequiredInformationTab() {
  const [filters, setFilters] = useState<Filter[]>([
    { id: "1", label: "Department", value: "Engineering" },
    { id: "2", label: "Location", value: "New York Office" },
    { id: "3", label: "Shift Type", value: "Day Shift" },
  ])
  const [clockingMethod, setClockingMethod] = useState<"default" | "override">("override")
  const [detectionMethod, setDetectionMethod] = useState<"saved" | "smart">("smart")

  const addFilter = () => {
    const newFilter: Filter = {
      id: Date.now().toString(),
      label: `Filter ${filters.length + 1}`,
      value: "",
    }
    setFilters([...filters, newFilter])
  }

  const removeFilter = (id: string) => {
    setFilters(filters.filter((f) => f.id !== id))
  }

  return (
    <div className="space-y-8">
      {/* Section 1: Company & Employee Identification */}
      <section className="border border-gray-200 rounded-lg p-6 bg-white">
        <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">
          Company & Employee Identification
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="company-number" className="text-sm font-medium text-gray-700 mb-2 block">
              Company Number <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Select defaultValue="001">
                <SelectTrigger id="company-number" className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="001">TechCorp (001)</SelectItem>
                  <SelectItem value="002">TechCorp Ltd (002)</SelectItem>
                </SelectContent>
              </Select>
              <Lock className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 italic mt-1">Must confirm to edit</p>
          </div>
          <div>
            <Label htmlFor="employee-number" className="text-sm font-medium text-gray-700 mb-2 block">
              Employee Number <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input id="employee-number" defaultValue="EMP-12345" className="h-10 pr-10" readOnly />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 italic mt-1">Must confirm to edit</p>
          </div>
          <div>
            <Label htmlFor="first-name" className="text-sm font-medium text-gray-700 mb-2 block">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input id="first-name" defaultValue="John" className="h-10" />
            <p className="text-xs text-gray-500 italic mt-1">Auto-filled</p>
          </div>
          <div>
            <Label htmlFor="last-name" className="text-sm font-medium text-gray-700 mb-2 block">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input id="last-name" defaultValue="Smith" className="h-10" />
            <p className="text-xs text-gray-500 italic mt-1">Auto-filled</p>
          </div>
        </div>
      </section>

      {/* Section 2: Employee Filters */}
      <section className="border border-gray-200 rounded-lg p-6 bg-white">
        <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">Employee Filters</h2>
        <div className="space-y-4">
          {filters.map((filter, index) => (
            <div key={filter.id} className="flex items-center gap-4">
              <div className="flex-1">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Filter {index + 1}: {filter.label}
                  {index === 0 && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <Select defaultValue={filter.value}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={filter.value}>{filter.value}</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {index > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFilter(filter.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-7"
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button variant="link" onClick={addFilter} className="text-blue-600 hover:text-blue-700 p-0 h-auto">
            <Plus className="w-4 h-4 mr-1" />
            Add Filter
          </Button>
        </div>
      </section>

      {/* Section 3: Work Configuration */}
      <section className="border border-gray-200 rounded-lg p-6 bg-white">
        <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">Work Configuration</h2>
        <div className="space-y-5">
          <div>
            <Label htmlFor="work-rules" className="text-sm font-medium text-gray-700 mb-2 block">
              Work Rules <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-3">
              <Select defaultValue="standard">
                <SelectTrigger id="work-rules" className="h-10 flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard 40hr Week</SelectItem>
                  <SelectItem value="flexible">Flexible Hours</SelectItem>
                  <SelectItem value="shift">Shift Work</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-10 bg-transparent">
                <FileText className="w-4 h-4 mr-2" />
                View Rules
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Quick access to assigned rules and shifts</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Clocking Method</Label>
            <RadioGroup value={clockingMethod} onValueChange={(v) => setClockingMethod(v as any)}>
              <div className="flex items-center space-x-2 mb-3">
                <RadioGroupItem value="default" id="default-method" />
                <Label htmlFor="default-method" className="font-normal cursor-pointer">
                  Use Work Rule Default
                </Label>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="override" id="override-method" />
                  <Label htmlFor="override-method" className="font-normal cursor-pointer">
                    Override:
                  </Label>
                </div>
                <div className="ml-6">
                  <Select defaultValue="smart" disabled={clockingMethod === "default"}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smart">Smart Clock Detection</SelectItem>
                      <SelectItem value="manual">Manual Entry</SelectItem>
                      <SelectItem value="biometric">Biometric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
      </section>

      {/* Section 4: Clocking Detection Settings */}
      <section className="border border-gray-200 rounded-lg p-6 bg-white">
        <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">
          Clocking Detection Settings
        </h2>
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Clocking Method <span className="text-red-500">*</span>
          </Label>
          <RadioGroup value={detectionMethod} onValueChange={(v) => setDetectionMethod(v as any)}>
            <div className="space-y-4">
              {/* Option 1 */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-2">
                  <RadioGroupItem value="saved" id="saved-method" className="mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="saved-method" className="font-normal cursor-pointer">
                        Clocking Saved as Received
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">System records IN/OUT exactly as sent by the time clock reader</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-[13px] text-gray-600 mt-1">System records IN/OUT exactly as sent by reader</p>
                  </div>
                </div>
              </div>

              {/* Option 2 */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-2">
                  <RadioGroupItem value="smart" id="smart-method" className="mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="smart-method" className="font-normal cursor-pointer">
                        Smart Clock Detection
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Automatically alternates between IN and OUT based on timing</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-[13px] text-gray-600 mt-1 mb-4">
                      {"First clock = IN, then alternates OUT, IN, OUT..."}
                    </p>

                    {detectionMethod === "smart" && (
                      <div className="ml-6 mt-3">
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          New Shift Detection Time Gap:
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input type="number" defaultValue="4" className="w-[70px] h-10 text-center" min="0" />
                          <span className="text-sm text-gray-700">hours</span>
                          <Input
                            type="number"
                            defaultValue="0"
                            className="w-[70px] h-10 text-center"
                            min="0"
                            max="59"
                          />
                          <span className="text-sm text-gray-700">minutes</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Time before next clock is considered a new shift</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>
      </section>

      {/* Section 5: Additional Required Information */}
      <section className="border border-gray-200 rounded-lg p-6 bg-white">
        <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">
          Additional Required Information
        </h2>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <Label htmlFor="holiday-calendar" className="text-sm font-medium text-gray-700 mb-2 block">
              Public Holiday Calendar <span className="text-red-500">*</span>
            </Label>
            <Select defaultValue="standard">
              <SelectTrigger id="holiday-calendar" className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Calendar</SelectItem>
                <SelectItem value="us">US Federal</SelectItem>
                <SelectItem value="uk">UK Bank Holidays</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="employment-date" className="text-sm font-medium text-gray-700 mb-2 block">
              Employment Date <span className="text-red-500">*</span>
            </Label>
            <Input id="employment-date" type="date" defaultValue="2020-01-15" className="h-10" />
          </div>
          <div>
            <Label htmlFor="reader-pin" className="text-sm font-medium text-gray-700 mb-2 block">
              Reader PIN <span className="text-red-500">*</span>
            </Label>
            <Input id="reader-pin" type="password" defaultValue="1234" className="h-10" />
          </div>
        </div>
      </section>
    </div>
  )
}
