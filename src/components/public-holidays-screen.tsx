"use client"

import { useState } from "react"
import CalendarList from "@/components/holidays/calendar-list"
import CalendarDetail from "@/components/holidays/calendar-detail"
import CreateCalendarModal from "@/components/holidays/create-calendar-modal"
import AddHolidayModal from "@/components/holidays/add-holiday-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { format } from "date-fns"

export interface Holiday {
  id: string
  name: string
  date: string
  dayOfWeek: string
  includeLostTime: boolean
  icon: string
  description?: string
  recurring?: boolean
}

export interface HolidayCalendar {
  id: string
  name: string
  code: string
  year: number
  holidayCount: number
  status: "active" | "draft" | "inactive"
  employeeCount: number
  includeLostTime: boolean
  created: string
  lastModified: string
  description?: string
  holidays: Holiday[]
}

// Mock data
const mockCalendars: HolidayCalendar[] = [
  {
    id: "1",
    name: "Standard US Calendar",
    code: "US-STD-2024",
    year: 2024,
    holidayCount: 25,
    status: "active",
    employeeCount: 245,
    includeLostTime: true,
    created: "Jan 15, 2024",
    lastModified: "Nov 20, 2024",
    description: "Standard US federal holidays",
    holidays: [
      {
        id: "h1",
        name: "New Year's Day",
        date: "2024-01-01",
        dayOfWeek: "Monday",
        includeLostTime: true,
        icon: "🎉",
      },
      {
        id: "h2",
        name: "Martin Luther King Jr. Day",
        date: "2024-01-15",
        dayOfWeek: "Monday",
        includeLostTime: true,
        icon: "🎉",
      },
      {
        id: "h3",
        name: "Presidents' Day",
        date: "2024-02-19",
        dayOfWeek: "Monday",
        includeLostTime: false,
        icon: "🎉",
      },
      {
        id: "h4",
        name: "Memorial Day",
        date: "2024-05-27",
        dayOfWeek: "Monday",
        includeLostTime: true,
        icon: "🎖️",
      },
      {
        id: "h5",
        name: "Independence Day",
        date: "2024-07-04",
        dayOfWeek: "Thursday",
        includeLostTime: true,
        icon: "🎆",
      },
      {
        id: "h6",
        name: "Labor Day",
        date: "2024-09-02",
        dayOfWeek: "Monday",
        includeLostTime: true,
        icon: "🎉",
      },
      {
        id: "h7",
        name: "Thanksgiving Day",
        date: "2024-11-28",
        dayOfWeek: "Thursday",
        includeLostTime: true,
        icon: "🎊",
      },
      {
        id: "h8",
        name: "Christmas Day",
        date: "2024-12-25",
        dayOfWeek: "Wednesday",
        includeLostTime: true,
        icon: "🎄",
      },
    ],
  },
  {
    id: "2",
    name: "UK Regional Calendar",
    code: "UK-REG-2024",
    year: 2024,
    holidayCount: 18,
    status: "active",
    employeeCount: 89,
    includeLostTime: true,
    created: "Feb 10, 2024",
    lastModified: "Oct 15, 2024",
    description: "UK bank holidays",
    holidays: [
      {
        id: "h9",
        name: "New Year's Day",
        date: "2024-01-01",
        dayOfWeek: "Monday",
        includeLostTime: true,
        icon: "🎉",
      },
      {
        id: "h10",
        name: "Good Friday",
        date: "2024-03-29",
        dayOfWeek: "Friday",
        includeLostTime: true,
        icon: "🎉",
      },
      {
        id: "h11",
        name: "Easter Monday",
        date: "2024-04-01",
        dayOfWeek: "Monday",
        includeLostTime: true,
        icon: "🎉",
      },
    ],
  },
  {
    id: "3",
    name: "APAC Calendar",
    code: "APAC-2024",
    year: 2024,
    holidayCount: 22,
    status: "active",
    employeeCount: 156,
    includeLostTime: false,
    created: "Jan 20, 2024",
    lastModified: "Sep 10, 2024",
    holidays: [],
  },
  {
    id: "4",
    name: "Corporate Events (Draft)",
    code: "CORP-DRAFT-2024",
    year: 2024,
    holidayCount: 5,
    status: "draft",
    employeeCount: 0,
    includeLostTime: true,
    created: "Nov 5, 2024",
    lastModified: "Nov 5, 2024",
    holidays: [],
  },
]

export default function PublicHolidaysScreen() {
  const [calendars, setCalendars] = useState<HolidayCalendar[]>(mockCalendars)
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>(mockCalendars[0].id)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isAddHolidayModalOpen, setIsAddHolidayModalOpen] = useState(false)
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null)

  const selectedCalendar = calendars.find((cal) => cal.id === selectedCalendarId)

  const handleCreateCalendar = (newCalendar: Omit<HolidayCalendar, "id">) => {
    const calendar: HolidayCalendar = {
      ...newCalendar,
      id: Math.random().toString(36).substr(2, 9),
    }
    setCalendars([...calendars, calendar])
    setSelectedCalendarId(calendar.id)
    setIsCreateModalOpen(false)
  }

  const handleAddHoliday = (holiday: Omit<Holiday, "id">) => {
    if (!selectedCalendar) return

    const newHoliday: Holiday = {
      ...holiday,
      id: Math.random().toString(36).substr(2, 9),
    }

    const updatedCalendars = calendars.map((cal) => {
      if (cal.id === selectedCalendarId) {
        return {
          ...cal,
          holidays: [...cal.holidays, newHoliday],
          holidayCount: cal.holidays.length + 1,
          lastModified: format(new Date(), "MMM d, yyyy"),
        }
      }
      return cal
    })

    setCalendars(updatedCalendars)
    setIsAddHolidayModalOpen(false)
    setEditingHoliday(null)
  }

  const handleEditHoliday = (holiday: Holiday) => {
    setEditingHoliday(holiday)
    setIsAddHolidayModalOpen(true)
  }

  const handleUpdateHoliday = (updatedHoliday: Omit<Holiday, "id">) => {
    if (!editingHoliday || !selectedCalendar) return

    const updatedCalendars = calendars.map((cal) => {
      if (cal.id === selectedCalendarId) {
        return {
          ...cal,
          holidays: cal.holidays.map((h) => (h.id === editingHoliday.id ? { ...updatedHoliday, id: h.id } : h)),
          lastModified: format(new Date(), "MMM d, yyyy"),
        }
      }
      return cal
    })

    setCalendars(updatedCalendars)
    setIsAddHolidayModalOpen(false)
    setEditingHoliday(null)
  }

  const handleDeleteHoliday = (holidayId: string) => {
    if (!selectedCalendar) return

    const updatedCalendars = calendars.map((cal) => {
      if (cal.id === selectedCalendarId) {
        const newHolidays = cal.holidays.filter((h) => h.id !== holidayId)
        return {
          ...cal,
          holidays: newHolidays,
          holidayCount: newHolidays.length,
          lastModified: format(new Date(), "MMM d, yyyy"),
        }
      }
      return cal
    })

    setCalendars(updatedCalendars)
  }

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <div className="border-b bg-background px-8 py-6">
        <div className="mx-auto flex max-w-[1400px] items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Public Holiday Calendars</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage holiday calendars for different regions and employee groups
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Calendar
          </Button>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="mx-auto max-w-[1400px] px-8 py-6">
        <div className="flex gap-6">
          {/* Left Column - Calendar List */}
          <div className="w-[400px] shrink-0">
            <CalendarList
              calendars={calendars}
              selectedCalendarId={selectedCalendarId}
              onSelectCalendar={setSelectedCalendarId}
            />
          </div>

          {/* Right Column - Calendar Detail */}
          <div className="flex-1">
            {selectedCalendar ? (
              <CalendarDetail
                calendar={selectedCalendar}
                onAddHoliday={() => setIsAddHolidayModalOpen(true)}
                onEditHoliday={handleEditHoliday}
                onDeleteHoliday={handleDeleteHoliday}
              />
            ) : (
              <div className="flex h-[400px] items-center justify-center rounded-lg border border-border bg-card">
                <p className="text-muted-foreground">Select a calendar to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateCalendarModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreateCalendar={handleCreateCalendar}
      />

      <AddHolidayModal
        open={isAddHolidayModalOpen}
        onOpenChange={(open) => {
          setIsAddHolidayModalOpen(open)
          if (!open) setEditingHoliday(null)
        }}
        onAddHoliday={editingHoliday ? handleUpdateHoliday : handleAddHoliday}
        editingHoliday={editingHoliday}
      />
    </div>
  )
}
