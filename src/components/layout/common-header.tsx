"use client"

import * as React from "react"
import Link from "next/link"
import { CalendarCheck2, LucideAlarmClockCheck, Type as type, type LucideIcon } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import ModeToggle from "@/components/mode-toggle"
import { Home, Users, BarChart3, Clock, CalendarOff, Repeat, Settings2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"

interface NavItem {
  icon: LucideIcon
  title: string
  route: string
}

const baseNavItems: NavItem[] = [
  {
    icon: Home,
    title: "Home",
    route: "/",
  },
]

export default function CommonHeader() {
  const router = useRouter()
  const params = useParams();

  console.log("params", params)
  const [isOpen, setIsOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | null>(null)

  // Build conditional nav items dynamically based on id in params
  const getConditionalNavItems = (): NavItem[] => {
    if (!params?.id) return []

    return [
      // {
      //   icon: CalendarOff,
      //   title: "Holiday",
      //   route: `/company/${params.id}/holiday`,
      // },
      {
        icon: Clock,
        title: "Working Rules",
        route: `/company/${params.id}/work-cycles`,
      },
    ]
  }

  const navItems = [...baseNavItems, ...getConditionalNavItems()]

  React.useEffect(() => {
    setDate(new Date())

    const timer = setInterval(() => {
      setDate(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    if (!date) return ""
    const hours = date.getHours()
    if (hours < 12) return "Good morning"
    if (hours < 18) return "Good afternoon"
    return "Good evening"
  }

  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy")
  }

  const formatTime = (date: Date) => {
    return format(date, "HH:mm")
  }

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile: Hamburger + Greeting, Desktop: Navigation */}
          <div className="flex items-center gap-3 flex-1">
            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <nav className="flex flex-col gap-2 mt-8">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.route}
                        href={item.route}
                        onClick={() => setIsOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-3"
                        >
                          <Icon className="w-5 h-5" />
                          {item.title}
                        </Button>
                      </Link>
                    )
                  })}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Mobile Greeting */}
            {date && (
              <div className="md:hidden">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {getGreeting()}
                </p>
              </div>
            )}

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.route} href={item.route}>
                    <Button
                      variant="ghost"
                      className="gap-2 flex items-center text-sm"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden lg:inline">{item.title}</span>
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Right: Time, Greeting (Desktop), Mode */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Desktop Time & Greeting */}
            {date && (
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs text-muted-foreground">
                  {getGreeting()}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-foreground tabular-nums">
                    {formatTime(date)}
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {formatDate(date)}
                  </span>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="hidden md:block border-l border-border h-6" />

            {/* Mode Toggle */}
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
