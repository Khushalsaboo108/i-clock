"use client"

import type React from "react"

import { useState } from "react"
import type { HolidayCalendar } from "@/components/public-holidays-screen"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface CreateCalendarModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateCalendar: (calendar: Omit<HolidayCalendar, "id">) => void
}

export default function CreateCalendarModal({ open, onOpenChange, onCreateCalendar }: CreateCalendarModalProps) {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [description, setDescription] = useState("")
  const [year, setYear] = useState("2025")
  const [includeLostTime, setIncludeLostTime] = useState<boolean>(true)
  const [useTemplate, setUseTemplate] = useState(false)
  const [template, setTemplate] = useState("")
  const [copyFromExisting, setCopyFromExisting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newCalendar: Omit<HolidayCalendar, "id"> = {
      name,
      code,
      description,
      year: Number.parseInt(year),
      holidayCount: 0,
      status: "draft",
      employeeCount: 0,
      includeLostTime,
      created: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      lastModified: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      holidays: [],
    }

    onCreateCalendar(newCalendar)
    resetForm()
  }

  const resetForm = () => {
    setName("")
    setCode("")
    setDescription("")
    setYear("2025")
    setIncludeLostTime(true)
    setUseTemplate(false)
    setTemplate("")
    setCopyFromExisting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Holiday Calendar</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Calendar Details */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-[#111827]">Calendar Details</h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">
                  Calendar Name <span className="text-[#EF4444]">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="US Regional Calendar 2025"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="code">
                  Calendar Code <span className="text-[#EF4444]">*</span>
                </Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="US-REG-2025"
                  required
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-[#6B7280]">Unique identifier for this calendar</p>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Regional holidays for US-based employees"
                  className="mt-1"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="year">
                  Year <span className="text-[#EF4444]">*</span>
                </Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-3 block">
                  Lost Time Setting <span className="text-[#EF4444]">*</span>
                </Label>
                <RadioGroup
                  value={includeLostTime ? "include" : "exclude"}
                  onValueChange={(value) => setIncludeLostTime(value === "include")}
                >
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="include" id="include" />
                    <Label htmlFor="include" className="font-normal">
                      Include lost time in calculations
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="exclude" id="exclude" />
                    <Label htmlFor="exclude" className="font-normal">
                      Do not include lost time
                    </Label>
                  </div>
                </RadioGroup>
                <p className="mt-2 text-xs text-[#6B7280]">
                  Lost time determines if holiday hours count toward targets
                </p>
              </div>
            </div>
          </div>

          {/* Quick Start Options */}
          <div className="border-t pt-6">
            <h3 className="mb-4 text-base font-semibold text-[#111827]">Quick Start Options</h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="template"
                  checked={useTemplate}
                  onCheckedChange={(checked) => setUseTemplate(checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="template" className="font-normal">
                    Import from template:
                  </Label>
                  {useTemplate && (
                    <Select value={template} onValueChange={setTemplate}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select template..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-federal">US Federal Holidays</SelectItem>
                        <SelectItem value="uk-bank">UK Bank Holidays</SelectItem>
                        <SelectItem value="canada">Canada Statutory Holidays</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="copy"
                  checked={copyFromExisting}
                  onCheckedChange={(checked) => setCopyFromExisting(checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="copy" className="font-normal">
                    Copy from existing calendar:
                  </Label>
                  {copyFromExisting && (
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select calendar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-std">Standard US Calendar</SelectItem>
                        <SelectItem value="uk-reg">UK Regional Calendar</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#2563EB] hover:bg-[#1d4ed8]">
              Create & Add Holidays
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
