"use client"

import { useState } from "react"
import type { HolidayCalendar } from "@/components/public-holidays-screen"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreVertical, Calendar } from "lucide-react"

interface CalendarListProps {
  calendars: HolidayCalendar[]
  selectedCalendarId: string
  onSelectCalendar: (id: string) => void
}

export default function CalendarList({ calendars, selectedCalendarId, onSelectCalendar }: CalendarListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCalendars = calendars.filter((cal) => cal.name.toLowerCase().includes(searchQuery.toLowerCase()))

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
    <div className="rounded-lg bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-[#111827]">My Holiday Calendars</h2>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
        <Input
          placeholder="Search calendars..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Calendar Cards */}
      <div className="space-y-3">
        {filteredCalendars.map((calendar) => (
          <div
            key={calendar.id}
            onClick={() => onSelectCalendar(calendar.id)}
            className={`cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md ${
              calendar.id === selectedCalendarId
                ? "border-l-4 border-l-[#2563EB] bg-[#EFF6FF]"
                : "border-[#E5E7EB] bg-white"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 text-[#8B5CF6]" />
                <div className="flex-1">
                  <h3 className="font-medium text-[#111827]">{calendar.name}</h3>
                  <div className="mt-1 flex items-center gap-2 text-sm text-[#6B7280]">
                    <span>{calendar.holidayCount} holidays</span>
                    <span>•</span>
                    <Badge className={`text-xs ${getStatusColor(calendar.status)}`}>
                      {calendar.status.charAt(0).toUpperCase() + calendar.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-[#9CA3AF]">
                    {calendar.employeeCount > 0 ? `Used by ${calendar.employeeCount} employees` : "Not assigned"}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem>Assign Employees</DropdownMenuItem>
                  <DropdownMenuItem className="text-[#EF4444]">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
