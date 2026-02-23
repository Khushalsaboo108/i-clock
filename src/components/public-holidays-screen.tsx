"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useSearchParams } from "next/navigation"
import CalendarList from "@/components/holidays/calendar-list"
import CalendarDetail from "@/components/holidays/calendar-detail"
import CreateCalendarModal from "@/components/holidays/create-calendar-modal"
import AddHolidayModal from "@/components/holidays/add-holiday-modal"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, CalendarDays } from "lucide-react"
import {
  createCalendarAction,
  getCalendarsAction,
  createHolidayAction,
  getHolidaysAction,
  deleteHolidayAction,
  getWeekendsAction,
  createWeekendAction,
} from "@/lib/actions"
import type { CalendarApiItem, HolidayApiItem, WeekendData } from "@/lib/actions"
import { showError, showSuccess } from "@/lib/toast"

export default function PublicHolidaysScreen() {
  const params = useParams();

  const searchParams = useSearchParams()
  const siteId = params?.id

  // Calendar state
  const [calendars, setCalendars] = useState<CalendarApiItem[]>([])
  const [selectedCalendarId, setSelectedCalendarId] = useState<number | null>(null)
  const [isLoadingCalendars, setIsLoadingCalendars] = useState(true)

  // Holidays state
  const [holidays, setHolidays] = useState<HolidayApiItem[]>([])
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(false)

  // Weekends state
  const [weekendDays, setWeekendDays] = useState<number[]>([])
  const [isLoadingWeekends, setIsLoadingWeekends] = useState(false)

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isAddHolidayModalOpen, setIsAddHolidayModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isCreatingHoliday, setIsCreatingHoliday] = useState(false)
  const [isSavingWeekends, setIsSavingWeekends] = useState(false)

  // ── Fetch Calendars ──
  const fetchCalendars = useCallback(async () => {
    if (!siteId) return
    setIsLoadingCalendars(true)
    try {
      const response = await getCalendarsAction(Number(siteId))
      console.log("[fetchCalendars] Full API response:", JSON.stringify(response, null, 2))
      if (response.success && response.data) {
        const data = response.data as CalendarApiItem[]
        console.log("[fetchCalendars] First calendar item:", data[0])
        setCalendars(data)
        // Auto-select first calendar if none selected
        if (selectedCalendarId === null && data.length > 0) {
          const firstId = data[0].id
          console.log("[fetchCalendars] Auto-selecting id:", firstId)
          setSelectedCalendarId(firstId)
        }
      } else {
        setCalendars([])
      }
    } catch (err) {
      showError("Failed to load calendars")
      console.error(err)
    } finally {
      setIsLoadingCalendars(false)
    }
  }, [siteId, selectedCalendarId])

  useEffect(() => {
    fetchCalendars()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId])

  // ── Fetch Holidays for selected calendar ──
  const fetchHolidays = useCallback(async (calendarId: number) => {
    setIsLoadingHolidays(true)
    try {
      const response = await getHolidaysAction(calendarId)
      if (response.success && response.data) {
        setHolidays(response.data as HolidayApiItem[])
      } else {
        setHolidays([])
      }
    } catch (err) {
      console.error(err)
      setHolidays([])
    } finally {
      setIsLoadingHolidays(false)
    }
  }, [])

  // ── Fetch Weekends for selected calendar ──
  const fetchWeekends = useCallback(async (calendarId: number) => {
    setIsLoadingWeekends(true)
    try {
      const response = await getWeekendsAction(calendarId)
      if (response.success && response.data) {
        // API returns data as a plain array e.g. [5, 6]
        setWeekendDays(response.data as number[])
      } else {
        setWeekendDays([])
      }
    } catch (err) {
      console.error(err)
      setWeekendDays([])
    } finally {
      setIsLoadingWeekends(false)
    }
  }, [])

  // When a calendar is selected, fetch its holidays & weekends
  useEffect(() => {
    if (selectedCalendarId) {
      fetchHolidays(selectedCalendarId)
      fetchWeekends(selectedCalendarId)
    }
  }, [selectedCalendarId, fetchHolidays, fetchWeekends])

  // ── Create Calendar ──
  const handleCreateCalendar = async (name: string) => {
    if (!siteId) {
      showError("No company selected. Please navigate from a company page.")
      return
    }

    setIsCreating(true)
    try {
      const response = await createCalendarAction(Number(siteId), name)
      if (response.success) {
        showSuccess("Calendar created successfully")
        setIsCreateModalOpen(false)
        await fetchCalendars()
      } else {
        showError(response.message || "Failed to create calendar")
      }
    } catch (err) {
      showError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsCreating(false)
    }
  }

  // ── Create Holiday ──
  const handleAddHoliday = async (
    name: string,
    holidayDate: string,
    isOptional: boolean,
    description: string
  ) => {
    if (!selectedCalendarId) {
      showError("Please select a calendar first")
      return
    }

    console.log("[handleAddHoliday] Creating holiday:", { selectedCalendarId, name, holidayDate, isOptional, description })

    setIsCreatingHoliday(true)
    try {
      const response = await createHolidayAction(
        selectedCalendarId,
        name,
        holidayDate,
        isOptional,
        description
      )
      console.log("[handleAddHoliday] Response:", response)
      if (response.success) {
        showSuccess("Holiday added successfully")
        setIsAddHolidayModalOpen(false)
        await fetchHolidays(selectedCalendarId)
      } else {
        showError(response.message || "Failed to add holiday")
      }
    } catch (err) {
      showError("An unexpected error occurred")
      console.error("[handleAddHoliday] Error:", err)
    } finally {
      setIsCreatingHoliday(false)
    }
  }

  // ── Update Weekends ──
  const handleWeekendToggle = async (day: number) => {
    if (!selectedCalendarId || !siteId) return

    const newDays = weekendDays.includes(day)
      ? weekendDays.filter((d) => d !== day)
      : [...weekendDays, day]

    setIsSavingWeekends(true)
    setWeekendDays(newDays) // Optimistic update
    try {
      const response = await createWeekendAction(Number(siteId), selectedCalendarId, newDays)
      if (response.success) {
        showSuccess("Weekend days updated")
      } else {
        // Revert on failure
        setWeekendDays(weekendDays)
        showError(response.message || "Failed to update weekends")
      }
    } catch (err) {
      setWeekendDays(weekendDays)
      showError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsSavingWeekends(false)
    }
  }

  // ── Delete Holiday ──
  const handleDeleteHoliday = async (holidayId: number) => {
    if (!selectedCalendarId) return

    try {
      const response = await deleteHolidayAction(holidayId)
      if (response.success) {
        showSuccess("Holiday deleted successfully")
        await fetchHolidays(selectedCalendarId)
      } else {
        showError(response.message || "Failed to delete holiday")
      }
    } catch (err) {
      showError("An unexpected error occurred")
      console.error(err)
    }
  }

  const selectedCalendar = calendars.find((cal) => cal.id === selectedCalendarId)

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Public Holiday Calendars</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage holiday calendars, weekends, and individual holidays
              </p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              New Calendar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoadingCalendars ? (
          <div className="flex gap-6">
            <div className="w-[400px] shrink-0 space-y-3">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
            <div className="flex-1 space-y-4">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        ) : calendars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <CalendarDays className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-semibold text-foreground">No calendars yet</h2>
            <p className="mt-2 text-sm text-muted-foreground text-center max-w-md">
              Create your first holiday calendar to start managing public holidays and weekends for your employees.
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)} className="mt-6 gap-2">
              <Plus className="w-4 h-4" />
              Create Calendar
            </Button>
          </div>
        ) : (
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
                  holidays={holidays}
                  isLoadingHolidays={isLoadingHolidays}
                  weekendDays={weekendDays}
                  isLoadingWeekends={isLoadingWeekends}
                  isSavingWeekends={isSavingWeekends}
                  onWeekendToggle={handleWeekendToggle}
                  onAddHoliday={() => setIsAddHolidayModalOpen(true)}
                  onDeleteHoliday={handleDeleteHoliday}
                />
              ) : (
                <div className="flex h-[400px] items-center justify-center rounded-lg border border-border bg-card">
                  <p className="text-muted-foreground">Select a calendar to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateCalendarModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreateCalendar={handleCreateCalendar}
        isCreating={isCreating}
      />

      <AddHolidayModal
        open={isAddHolidayModalOpen}
        onOpenChange={setIsAddHolidayModalOpen}
        onAddHoliday={handleAddHoliday}
        isCreating={isCreatingHoliday}
      />
    </div>
  )
}
