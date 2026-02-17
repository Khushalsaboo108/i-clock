"use client"

import type { HolidayCalendar, Holiday } from "@/components/public-holidays-screen"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Plus, Edit, Settings, Trash2, Check, X } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"

interface CalendarDetailProps {
  calendar: HolidayCalendar
  onAddHoliday: () => void
  onEditHoliday: (holiday: Holiday) => void
  onDeleteHoliday: (holidayId: string) => void
}

export default function CalendarDetail({
  calendar,
  onAddHoliday,
  onEditHoliday,
  onDeleteHoliday,
}: CalendarDetailProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Convert holiday dates to Date objects for calendar highlighting
  const holidayDates = calendar.holidays.map((h) => new Date(h.date))

  const getStatusColor = (status: HolidayCalendar["status"]) => {
    switch (status) {
      case "active":
        return "bg-[#10B981] text-white"
      case "draft":
        return "bg-[#F59E0B] text-white"
      case "inactive":
        return "bg-[#6B7280] text-white"
    }
  }

  return (
    <div className="rounded-lg bg-card">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{calendar.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Calendar Code: {calendar.code}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div className="border-b border-border p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <span>📊</span> Overview
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Total Holidays</p>
            <p className="mt-1 text-base font-semibold text-foreground">{calendar.holidayCount}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge className={`mt-1 ${getStatusColor(calendar.status)}`}>
              {calendar.status === "active" && "🟢 "}
              {calendar.status.charAt(0).toUpperCase() + calendar.status.slice(1)}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Assigned to</p>
            <p className="mt-1 text-base font-semibold text-foreground">{calendar.employeeCount} employees</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Lost Time</p>
            <p className="mt-1 text-base font-semibold text-foreground">
              {calendar.includeLostTime ? "Included" : "Not Included"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p className="mt-1 text-base text-foreground">{calendar.created}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Modified</p>
            <p className="mt-1 text-base text-foreground">{calendar.lastModified}</p>
          </div>
        </div>
      </div>

      {/* Calendar View Section */}
      <div className="border-b border-border p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <span>📅</span> Calendar View
          </h3>
          <Button onClick={onAddHoliday} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Holiday
          </Button>
        </div>
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              holiday: holidayDates,
            }}
            modifiersClassNames={{
              holiday: "bg-primary text-primary-foreground hover:bg-primary/90",
            }}
          />
        </div>
      </div>

      {/* Holiday List Section */}
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <span>📋</span> Holiday List ({calendar.year})
          </h3>
          <Button onClick={onAddHoliday} variant="outline" size="sm" className="text-primary bg-transparent hover:bg-muted">
            <Plus className="mr-2 h-4 w-4" />
            Add Holiday
          </Button>
        </div>

        {calendar.holidays.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
            <p className="text-sm text-muted-foreground">No holidays added yet. Click "Add Holiday" to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {calendar.holidays
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((holiday) => (
                <div
                  key={holiday.id}
                  className="rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{holiday.icon}</span>
                      <div>
                        <h4 className="font-medium text-foreground">{holiday.name}</h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Date:{" "}
                          {format(new Date(holiday.date), "MMMM d, yyyy")}{" "}
                          ({holiday.dayOfWeek})
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">Lost Time:</span>
                          {holiday.includeLostTime ? (
                            <span className="flex items-center gap-1 text-sm text-[#10B981]">
                              <Check className="h-4 w-4" />
                              Included
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-sm text-[#EF4444]">
                              <X className="h-4 w-4" />
                              Not Included
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => onEditHoliday(holiday)}>
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteHoliday(holiday.id)}
                        className="text-[#EF4444] hover:bg-[#FEE2E2]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
