"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, Clock, Copy, Search, Settings, ChevronRight } from "lucide-react"
import { ShiftFormModal } from "./shift-form-modal"

export type ShiftRule = {
    id: string
    type: "primary" | "extra" | "deduct"
    name: string
    startTime: string
    endTime: string
    gracePeriod: number
    lateFlag: boolean
    earlyFlag: boolean
    payRate: string
    holidayPayRate: string
    isPaid: boolean
    allowedTime?: number
}

export type Shift = {
    id: string
    code: string
    description: string
    targetHours: number
    roundingMinutes: number
    balanceRule: "carry-forward" | "reset" | "cap"
    calculationMethod: "clock-to-clock" | "first-to-last"
    isActive: boolean
    rules: ShiftRule[]
    employeeCount: number
    createdAt: string
    updatedAt: string
}

const mockShifts: Shift[] = [
    {
        id: "1",
        code: "DAY-STD",
        description: "Standard Day Shift",
        targetHours: 8,
        roundingMinutes: 15,
        balanceRule: "carry-forward",
        calculationMethod: "clock-to-clock",
        isActive: true,
        employeeCount: 145,
        createdAt: "2024-01-15",
        updatedAt: "2024-11-20",
        rules: [
            {
                id: "r1",
                type: "primary",
                name: "Day Shift",
                startTime: "08:00",
                endTime: "17:00",
                gracePeriod: 5,
                lateFlag: true,
                earlyFlag: true,
                payRate: "Normal",
                holidayPayRate: "Double",
                isPaid: true,
            },
            {
                id: "r2",
                type: "deduct",
                name: "Lunch Break",
                startTime: "12:00",
                endTime: "13:00",
                gracePeriod: 0,
                lateFlag: false,
                earlyFlag: false,
                payRate: "None",
                holidayPayRate: "None",
                isPaid: false,
                allowedTime: 60,
            },
        ],
    },
    {
        id: "2",
        code: "NIGHT-STD",
        description: "Standard Night Shift",
        targetHours: 8,
        roundingMinutes: 15,
        balanceRule: "carry-forward",
        calculationMethod: "clock-to-clock",
        isActive: true,
        employeeCount: 67,
        createdAt: "2024-01-15",
        updatedAt: "2024-10-15",
        rules: [
            {
                id: "r3",
                type: "primary",
                name: "Night Shift",
                startTime: "22:00",
                endTime: "06:00",
                gracePeriod: 10,
                lateFlag: true,
                earlyFlag: true,
                payRate: "Night Differential",
                holidayPayRate: "Triple",
                isPaid: true,
            },
        ],
    },
    {
        id: "3",
        code: "FLEX-8",
        description: "Flexible 8-Hour Shift",
        targetHours: 8,
        roundingMinutes: 30,
        balanceRule: "cap",
        calculationMethod: "first-to-last",
        isActive: true,
        employeeCount: 89,
        createdAt: "2024-02-01",
        updatedAt: "2024-11-10",
        rules: [
            {
                id: "r4",
                type: "primary",
                name: "Flex Window",
                startTime: "06:00",
                endTime: "20:00",
                gracePeriod: 0,
                lateFlag: false,
                earlyFlag: false,
                payRate: "Normal",
                holidayPayRate: "Double",
                isPaid: true,
            },
        ],
    },
    {
        id: "4",
        code: "PART-4",
        description: "Part-Time 4 Hours",
        targetHours: 4,
        roundingMinutes: 15,
        balanceRule: "reset",
        calculationMethod: "clock-to-clock",
        isActive: false,
        employeeCount: 23,
        createdAt: "2024-03-01",
        updatedAt: "2024-08-20",
        rules: [],
    },
]

export function ShiftsScreen() {
    const [shifts, setShifts] = useState<Shift[]>(mockShifts)
    const [searchQuery, setSearchQuery] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingShift, setEditingShift] = useState<Shift | null>(null)

    const filteredShifts = shifts.filter(
        (shift) =>
            shift.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shift.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAddShift = () => {
        setEditingShift(null)
        setIsModalOpen(true)
    }

    const handleEditShift = (shift: Shift) => {
        setEditingShift(shift)
        setIsModalOpen(true)
    }

    const handleDuplicateShift = (shift: Shift) => {
        const newShift: Shift = {
            ...shift,
            id: `${Date.now()}`,
            code: `${shift.code}-COPY`,
            description: `${shift.description} (Copy)`,
            employeeCount: 0,
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
            rules: shift.rules.map((r) => ({ ...r, id: `${Date.now()}-${r.id}` })),
        }
        setShifts([...shifts, newShift])
    }

    const handleDeleteShift = (id: string) => {
        const shift = shifts.find((s) => s.id === id)
        if (shift && shift.employeeCount > 0) {
            alert(`Cannot delete shift. ${shift.employeeCount} employees are assigned to it.`)
            return
        }
        if (confirm("Are you sure you want to delete this shift?")) {
            setShifts(shifts.filter((s) => s.id !== id))
        }
    }

    const handleSaveShift = (shiftData: Omit<Shift, "id" | "employeeCount" | "createdAt" | "updatedAt">) => {
        if (editingShift) {
            setShifts(
                shifts.map((s) =>
                    s.id === editingShift.id
                        ? {
                            ...s,
                            ...shiftData,
                            updatedAt: new Date().toISOString().split("T")[0],
                        }
                        : s
                )
            )
        } else {
            const newShift: Shift = {
                ...shiftData,
                id: `${Date.now()}`,
                employeeCount: 0,
                createdAt: new Date().toISOString().split("T")[0],
                updatedAt: new Date().toISOString().split("T")[0],
            }
            setShifts([...shifts, newShift])
        }
        setIsModalOpen(false)
        setEditingShift(null)
    }

    const activeShifts = shifts.filter((s) => s.isActive)
    const totalEmployees = shifts.reduce((sum, s) => sum + s.employeeCount, 0)

    return (
        <div className="min-h-screen bg-muted/40">
            {/* Header */}
            <header className="bg-background border-b border-border">
                <div className="px-8 py-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-foreground">Shift Management</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Define shift patterns, rules, and calculation methods
                            </p>
                        </div>
                        <Button onClick={handleAddShift} className="gap-2">
                            <Plus className="w-4 h-4" />
                            Create Shift
                        </Button>
                    </div>
                </div>
            </header>

            <div className="px-8 py-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Shifts</p>
                                    <p className="text-2xl font-bold text-foreground">{shifts.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <Settings className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Active Shifts</p>
                                    <p className="text-2xl font-bold text-foreground">{activeShifts.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                    <ChevronRight className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Rules</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {shifts.reduce((sum, s) => sum + s.rules.length, 0)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Employees Assigned</p>
                                    <p className="text-2xl font-bold text-foreground">{totalEmployees}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search shifts by code or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Shifts Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">All Shifts</CardTitle>
                        <CardDescription>Configure shift patterns and rules for time calculations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Target</TableHead>
                                    <TableHead>Calculation</TableHead>
                                    <TableHead>Rules</TableHead>
                                    <TableHead>Employees</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredShifts.map((shift) => (
                                    <TableRow key={shift.id}>
                                        <TableCell className="font-mono font-medium">{shift.code}</TableCell>
                                        <TableCell>{shift.description}</TableCell>
                                        <TableCell>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4 text-muted-foreground" />
                                                {shift.targetHours}h
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {shift.calculationMethod.replace("-", " ")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Badge variant="secondary" className="text-xs">
                                                    {shift.rules.filter((r) => r.type === "primary").length} primary
                                                </Badge>
                                                {shift.rules.filter((r) => r.type === "deduct").length > 0 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {shift.rules.filter((r) => r.type === "deduct").length} deduct
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-muted-foreground">{shift.employeeCount}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    shift.isActive
                                                        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400"
                                                        : "bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400"
                                                }
                                            >
                                                {shift.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEditShift(shift)}
                                                    className="h-8 w-8 p-0"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDuplicateShift(shift)}
                                                    className="h-8 w-8 p-0"
                                                    title="Duplicate"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteShift(shift.id)}
                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
                                                    title="Delete"
                                                    disabled={shift.employeeCount > 0}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredShifts.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                            No shifts found. Create your first shift to get started.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Modal */}
            <ShiftFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setEditingShift(null)
                }}
                onSave={handleSaveShift}
                editingShift={editingShift}
            />
        </div>
    )
}
