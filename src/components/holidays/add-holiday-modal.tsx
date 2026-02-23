"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

interface AddHolidayModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddHoliday: (name: string, holidayDate: string, isOptional: boolean, description: string) => void
  isCreating?: boolean
}

export default function AddHolidayModal({ open, onOpenChange, onAddHoliday, isCreating }: AddHolidayModalProps) {
  const [name, setName] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [description, setDescription] = useState("")
  const [isOptional, setIsOptional] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !name.trim()) return

    const holidayDate = format(date, "yyyy-MM-dd")
    onAddHoliday(name, holidayDate, isOptional, description)
  }

  const resetForm = () => {
    setName("")
    setDate(undefined)
    setDescription("")
    setIsOptional(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(openState) => {
        onOpenChange(openState)
        if (!openState) resetForm()
      }}
    >
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Add Public Holiday</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="holiday-name">
              Holiday Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="holiday-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. New Year's Day"
              required
              className="mt-1.5"
            />
          </div>

          <div>
            <Label>
              Holiday Date <span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="mt-1.5 w-full justify-start text-left font-normal bg-transparent"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "MMMM d, yyyy") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="holiday-description">Description (Optional)</Label>
            <Textarea
              id="holiday-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the holiday"
              className="mt-1.5"
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <Label htmlFor="optional-toggle" className="cursor-pointer">Optional Holiday</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Employees can choose whether to take this day off
              </p>
            </div>
            <Switch
              id="optional-toggle"
              checked={isOptional}
              onCheckedChange={setIsOptional}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                resetForm()
              }}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !name.trim() || !date}>
              {isCreating ? "Adding..." : "Add Holiday"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
