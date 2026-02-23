"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CreateCalendarModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateCalendar: (name: string) => void
  isCreating?: boolean
}

export default function CreateCalendarModal({ open, onOpenChange, onCreateCalendar, isCreating }: CreateCalendarModalProps) {
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onCreateCalendar(name)
  }

  const resetForm = () => {
    setName("")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(openState) => {
        onOpenChange(openState)
        if (!openState) resetForm()
      }}
    >
      <DialogContent className="max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Calendar</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="calendar-name">
              Calendar Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="calendar-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Public Holidays 2025"
              required
              className="mt-1.5"
              autoFocus
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Give your calendar a descriptive name to identify it easily.
            </p>
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
            <Button type="submit" disabled={isCreating || !name.trim()}>
              {isCreating ? "Creating..." : "Create Calendar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
