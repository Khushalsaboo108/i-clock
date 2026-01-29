"use client"

import * as React from "react"
import ModeToggle from "@/components/mode-toggle"
import { LucideIcon } from "lucide-react"

interface CommonHeaderProps {
    title: string
    description?: string
    icon?: LucideIcon
}

export function CommonHeader() {
    const [date, setDate] = React.useState<Date | null>(null)

    React.useEffect(() => {
        // Set initial date on mount to match client time and avoid hydration mismatch
        setDate(new Date())

        const timer = setInterval(() => {
            setDate(new Date())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    // Greeting logic
    const getGreeting = () => {
        if (!date) return ""
        const hours = date.getHours()
        if (hours < 12) return "Good morning"
        if (hours < 18) return "Good afternoon"
        return "Good evening"
    }

    // Date formatting
    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    // Time formatting
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <div className="border-b border-border bg-card w-full">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-end gap-4">

                    {/* Left Side: Title & Description */}
                    {/* <div className="flex items-center gap-3">
                        {Icon && <Icon className="w-8 h-8 text-primary" />}
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                            {description && (
                                <p className="text-sm text-muted-foreground">{description}</p>
                            )}
                        </div>
                    </div> */}

                    {/* Right Side: Greeting, Clock, Toggle */}
                    <div className="flex items-center gap-6">
                        {date && (
                            <div className="hidden md:flex flex-col items-end text-right">
                                <p className="text-sm font-medium text-muted-foreground">
                                    {getGreeting()}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-foreground tabular-nums">
                                        {formatTime(date)}
                                    </span>
                                    <span className="text-sm text-muted-foreground tabular-nums">
                                        {formatDate(date)}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="border-l border-border pl-6">
                            <ModeToggle />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
