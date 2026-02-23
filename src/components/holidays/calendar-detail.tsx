"use client"

import type { CalendarApiItem, HolidayApiItem } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, CalendarDays, Loader2, Trash2 } from "lucide-react"
import { format } from "date-fns"

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const

interface CalendarDetailProps {
  calendar: CalendarApiItem
  holidays: HolidayApiItem[]
  isLoadingHolidays: boolean
  weekendDays: number[]
  isLoadingWeekends: boolean
  isSavingWeekends: boolean
  onWeekendToggle: (day: number) => void
  onAddHoliday: () => void
  onDeleteHoliday: (holidayId: number) => void
}

export default function CalendarDetail({
  calendar,
  holidays,
  isLoadingHolidays,
  weekendDays,
  isLoadingWeekends,
  isSavingWeekends,
  onWeekendToggle,
  onAddHoliday,
  onDeleteHoliday,
}: CalendarDetailProps) {
  return (
    <div className="rounded-lg bg-card">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{calendar.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Calendar ID: {calendar.id}
            </p>
          </div>
        </div>
      </div>

      {/* Weekend Section */}
      <div className="border-b border-border p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <span>📅</span> Weekend Days
          </h3>
          {isSavingWeekends && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving...
            </span>
          )}
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Select the days that should be treated as weekends (non-working days).
        </p>
        {isLoadingWeekends ? (
          <div className="flex gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-14 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {DAY_LABELS.map((label, index) => {
              const isSelected = weekendDays.includes(index)
              return (
                <button
                  key={index}
                  onClick={() => onWeekendToggle(index)}
                  disabled={isSavingWeekends}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium border transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                    }
                  `}
                >
                  {label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Holidays Section */}
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <span>📋</span> Holidays
          </h3>
          <Button onClick={onAddHoliday} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Holiday
          </Button>
        </div>

        {isLoadingHolidays ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : holidays.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 rounded-lg border border-dashed border-border">
            <CalendarDays className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No holidays added yet.</p>
            <Button onClick={onAddHoliday} variant="outline" size="sm" className="mt-3 gap-1.5">
              <Plus className="h-4 w-4" />
              Add Holiday
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {holidays.map((holiday, index) => (
              <div
                key={holiday.holiday_id || index}
                className="rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <h4 className="font-medium text-foreground">{holiday.name}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {holiday.holiday_date
                          ? format(new Date(holiday.holiday_date), "MMMM d, yyyy (EEEE)")
                          : "No date set"}
                      </p>
                      {holiday.descripti && (
                        <p className="mt-1 text-sm text-muted-foreground">{holiday.descripti}</p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        {holiday.is_optional && (
                          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                            Optional
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const id = holiday.id ?? holiday.holiday_id
                      if (id != null) onDeleteHoliday(id)
                    }}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    title="Delete holiday"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
