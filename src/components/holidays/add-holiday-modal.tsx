"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Holiday } from "@/components/public-holidays-screen"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

interface AddHolidayModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddHoliday: (holiday: Omit<Holiday, "id">) => void
  editingHoliday?: Holiday | null
}

export default function AddHolidayModal({ open, onOpenChange, onAddHoliday, editingHoliday }: AddHolidayModalProps) {
  const [name, setName] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [description, setDescription] = useState("")
  const [includeLostTime, setIncludeLostTime] = useState<boolean>(true)
  const [recurring, setRecurring] = useState(false)
  const [icon, setIcon] = useState("🎉")

  const iconOptions = ["🎉", "🎄", "🎆", "🎊", "🎁", "🗽", "🎖️", "❤️"]

  useEffect(() => {
    if (editingHoliday) {
      setName(editingHoliday.name)
      setDate(new Date(editingHoliday.date))
      setDescription(editingHoliday.description || "")
      setIncludeLostTime(editingHoliday.includeLostTime)
      setIcon(editingHoliday.icon)
      setRecurring(editingHoliday.recurring || false)
    } else {
      resetForm()
    }
  }, [editingHoliday, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date) return

    const dayOfWeek = format(date, "EEEE")

    const holiday: Omit<Holiday, "id"> = {
      name,
      date: format(date, "yyyy-MM-dd"),
      dayOfWeek,
      includeLostTime,
      icon,
      description,
      recurring,
    }

    onAddHoliday(holiday)
    resetForm()
  }

  const resetForm = () => {
    setName("")
    setDate(undefined)
    setDescription("")
    setIncludeLostTime(true)
    setRecurring(false)
    setIcon("🎉")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{editingHoliday ? "Edit Holiday" : "Add Public Holiday"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="holiday-name">
              Holiday Name <span className="text-[#EF4444]">*</span>
            </Label>
            <Input
              id="holiday-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New Year's Day"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label>
              Holiday Date <span className="text-[#EF4444]">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="mt-1 w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "MM/dd/yyyy") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
            <p className="mt-1 text-xs text-[#6B7280]">Click to open date picker</p>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Federal holiday celebrating the new year"
              className="mt-1"
              rows={2}
            />
          </div>

          <div>
            <Label className="mb-3 block">
              Lost Time Setting <span className="text-[#EF4444]">*</span>
            </Label>
            <RadioGroup
              value={includeLostTime ? "include" : "exclude"}
              onValueChange={(value) => setIncludeLostTime(value === "include")}
            >
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="include" id="include-lost" />
                  <div>
                    <Label htmlFor="include-lost" className="font-normal">
                      Include lost time
                    </Label>
                    <p className="text-xs text-[#6B7280]">Holiday hours count toward employee target hours</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="exclude" id="exclude-lost" />
                  <div>
                    <Label htmlFor="exclude-lost" className="font-normal">
                      Do not include lost time
                    </Label>
                    <p className="text-xs text-[#6B7280]">Holiday hours do not count toward target</p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Additional Options */}
          <div className="border-t pt-6">
            <h3 className="mb-4 text-base font-semibold text-[#111827]">Additional Options</h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="recurring"
                  checked={recurring}
                  onCheckedChange={(checked) => setRecurring(checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="recurring" className="font-normal">
                    Recurring holiday
                  </Label>
                  {recurring && (
                    <div className="mt-2 space-y-2">
                      <Select defaultValue="annually">
                        <SelectTrigger>
                          <SelectValue placeholder="Repeat..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="annually">Annually</SelectItem>
                          <SelectItem value="biannually">Biannually</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="same-date">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="same-date">Same date each year</SelectItem>
                          <SelectItem value="same-day">Same day of week</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="icon">Holiday Icon (Optional)</Label>
                <Select value={icon} onValueChange={setIcon}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((emoji) => (
                      <SelectItem key={emoji} value={emoji}>
                        <span className="text-xl">{emoji}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t pt-6">
            {editingHoliday && (
              <Button
                type="button"
                variant="outline"
                className="text-[#EF4444] hover:bg-[#FEE2E2] bg-transparent"
                onClick={() => {
                  // Delete functionality would go here
                  onOpenChange(false)
                }}
              >
                Delete Holiday
              </Button>
            )}
            <div className="ml-auto flex gap-3">
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
                {editingHoliday ? "Save Changes" : "Add Holiday"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
