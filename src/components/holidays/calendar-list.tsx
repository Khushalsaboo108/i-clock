"use client"

import { useState } from "react"
import type { CalendarApiItem } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Calendar } from "lucide-react"

interface CalendarListProps {
  calendars: CalendarApiItem[]
  selectedCalendarId: number | null
  onSelectCalendar: (id: number) => void
}

export default function CalendarList({ calendars, selectedCalendarId, onSelectCalendar }: CalendarListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCalendars = calendars.filter((cal) =>
    cal.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="rounded-lg bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold text-foreground">My Holiday Calendars</h2>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search calendars..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Calendar Cards */}
      <div className="space-y-3">
        {filteredCalendars.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border">
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "No calendars match your search" : "No calendars found"}
            </p>
          </div>
        ) : (
          filteredCalendars.map((calendar) => (
            <div
              key={calendar.id}
              onClick={() => onSelectCalendar(calendar.id)}
              className={`cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md ${calendar.id === selectedCalendarId
                ? "border-l-4 border-l-[#2563EB] bg-[#EFF6FF] dark:bg-blue-900/20"
                : "border-border bg-card"
                }`}
            >
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 text-primary" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{calendar.name}</h3>
                  {calendar.created_at && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Created {new Date(calendar.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
