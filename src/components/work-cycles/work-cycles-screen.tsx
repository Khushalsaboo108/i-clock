"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, Calendar, Copy, Search, RefreshCw } from "lucide-react"
import { WorkCycleFormModal } from "./work-cycle-form-modal"

export type ShiftAllocation = {
    day: number // 1-7 for Mon-Sun, or day of cycle
    shiftCodes: string[]
}

export type WorkCycle = {
    id: string
    code: string
    description: string
    startDate: string
    cycleLength: number // in days
    cycleLengthType: "days" | "weeks"
    clockDetectionMethod: "directional" | "auto-detection"
    targetType: "weekly" | "fortnightly" | "monthly"
    targetHours: number
    columnLimit: number | null
    overflowHandling: "carry-forward" | "cap" | "lose"
    balanceRule: "carry-forward" | "reset" | "cap"
    isActive: boolean
    shiftAllocations: ShiftAllocation[]
    employeeCount: number
    createdAt: string
    updatedAt: string
}

const mockWorkCycles: WorkCycle[] = [
    {
        id: "1",
        code: "WC-STANDARD",
        description: "Standard 5-Day Work Week",
        startDate: "2024-01-01",
        cycleLength: 7,
        cycleLengthType: "days",
        clockDetectionMethod: "auto-detection",
        targetType: "weekly",
        targetHours: 40,
        columnLimit: 10,
        overflowHandling: "carry-forward",
        balanceRule: "carry-forward",
        isActive: true,
        shiftAllocations: [
            { day: 1, shiftCodes: ["DAY-STD"] },
            { day: 2, shiftCodes: ["DAY-STD"] },
            { day: 3, shiftCodes: ["DAY-STD"] },
            { day: 4, shiftCodes: ["DAY-STD"] },
            { day: 5, shiftCodes: ["DAY-STD"] },
            { day: 6, shiftCodes: [] },
            { day: 7, shiftCodes: [] },
        ],
        employeeCount: 156,
        createdAt: "2024-01-01",
        updatedAt: "2024-11-15",
    },
    {
        id: "2",
        code: "WC-SHIFT-ROT",
        description: "Rotating Shift Pattern (2 weeks)",
        startDate: "2024-01-01",
        cycleLength: 14,
        cycleLengthType: "days",
        clockDetectionMethod: "directional",
        targetType: "fortnightly",
        targetHours: 80,
        columnLimit: 12,
        overflowHandling: "cap",
        balanceRule: "reset",
        isActive: true,
        shiftAllocations: [
            { day: 1, shiftCodes: ["DAY-STD"] },
            { day: 2, shiftCodes: ["DAY-STD"] },
            { day: 3, shiftCodes: ["DAY-STD"] },
            { day: 4, shiftCodes: ["DAY-STD"] },
            { day: 5, shiftCodes: ["DAY-STD"] },
            { day: 6, shiftCodes: [] },
            { day: 7, shiftCodes: [] },
            { day: 8, shiftCodes: ["NIGHT-STD"] },
            { day: 9, shiftCodes: ["NIGHT-STD"] },
            { day: 10, shiftCodes: ["NIGHT-STD"] },
            { day: 11, shiftCodes: ["NIGHT-STD"] },
            { day: 12, shiftCodes: ["NIGHT-STD"] },
            { day: 13, shiftCodes: [] },
            { day: 14, shiftCodes: [] },
        ],
        employeeCount: 48,
        createdAt: "2024-02-01",
        updatedAt: "2024-10-20",
    },
    {
        id: "3",
        code: "WC-FLEX",
        description: "Flexible Monthly Cycle",
        startDate: "2024-01-01",
        cycleLength: 30,
        cycleLengthType: "days",
        clockDetectionMethod: "auto-detection",
        targetType: "monthly",
        targetHours: 160,
        columnLimit: null,
        overflowHandling: "carry-forward",
        balanceRule: "cap",
        isActive: true,
        shiftAllocations: [],
        employeeCount: 34,
        createdAt: "2024-03-01",
        updatedAt: "2024-11-01",
    },
    {
        id: "4",
        code: "WC-PARTTIME",
        description: "Part-Time Schedule",
        startDate: "2024-01-01",
        cycleLength: 7,
        cycleLengthType: "days",
        clockDetectionMethod: "auto-detection",
        targetType: "weekly",
        targetHours: 20,
        columnLimit: 6,
        overflowHandling: "lose",
        balanceRule: "reset",
        isActive: false,
        shiftAllocations: [
            { day: 1, shiftCodes: ["PART-4"] },
            { day: 2, shiftCodes: ["PART-4"] },
            { day: 3, shiftCodes: ["PART-4"] },
            { day: 4, shiftCodes: ["PART-4"] },
            { day: 5, shiftCodes: ["PART-4"] },
            { day: 6, shiftCodes: [] },
            { day: 7, shiftCodes: [] },
        ],
        employeeCount: 12,
        createdAt: "2024-04-01",
        updatedAt: "2024-08-15",
    },
]

export function WorkCyclesScreen() {
    const [workCycles, setWorkCycles] = useState<WorkCycle[]>(mockWorkCycles)
    const [searchQuery, setSearchQuery] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCycle, setEditingCycle] = useState<WorkCycle | null>(null)

    const filteredCycles = workCycles.filter(
        (cycle) =>
            cycle.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cycle.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAddCycle = () => {
        setEditingCycle(null)
        setIsModalOpen(true)
    }

    const handleEditCycle = (cycle: WorkCycle) => {
        setEditingCycle(cycle)
        setIsModalOpen(true)
    }

    const handleDuplicateCycle = (cycle: WorkCycle) => {
        const newCycle: WorkCycle = {
            ...cycle,
            id: `${Date.now()}`,
            code: `${cycle.code}-COPY`,
            description: `${cycle.description} (Copy)`,
            employeeCount: 0,
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
        }
        setWorkCycles([...workCycles, newCycle])
    }

    const handleDeleteCycle = (id: string) => {
        const cycle = workCycles.find((c) => c.id === id)
        if (cycle && cycle.employeeCount > 0) {
            alert(`Cannot delete work cycle. ${cycle.employeeCount} employees are assigned to it.`)
            return
        }
        if (confirm("Are you sure you want to delete this work cycle?")) {
            setWorkCycles(workCycles.filter((c) => c.id !== id))
        }
    }

    const handleSaveCycle = (cycleData: Omit<WorkCycle, "id" | "employeeCount" | "createdAt" | "updatedAt">) => {
        if (editingCycle) {
            setWorkCycles(
                workCycles.map((c) =>
                    c.id === editingCycle.id
                        ? {
                            ...c,
                            ...cycleData,
                            updatedAt: new Date().toISOString().split("T")[0],
                        }
                        : c
                )
            )
        } else {
            const newCycle: WorkCycle = {
                ...cycleData,
                id: `${Date.now()}`,
                employeeCount: 0,
                createdAt: new Date().toISOString().split("T")[0],
                updatedAt: new Date().toISOString().split("T")[0],
            }
            setWorkCycles([...workCycles, newCycle])
        }
        setIsModalOpen(false)
        setEditingCycle(null)
    }

    const activeCycles = workCycles.filter((c) => c.isActive)
    const totalEmployees = workCycles.reduce((sum, c) => sum + c.employeeCount, 0)

    return (
        <div className="min-h-screen bg-muted/40">
            {/* Header */}
            <header className="bg-background border-b border-border">
                <div className="px-8 py-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-foreground">Work Cycles</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Define work cycle patterns and shift allocations
                            </p>
                        </div>
                        <Button onClick={handleAddCycle} className="gap-2">
                            <Plus className="w-4 h-4" />
                            Create Work Cycle
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
                                    <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Cycles</p>
                                    <p className="text-2xl font-bold text-foreground">{workCycles.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Active Cycles</p>
                                    <p className="text-2xl font-bold text-foreground">{activeCycles.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                    <RefreshCw className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Avg Cycle Length</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {Math.round(workCycles.reduce((sum, c) => sum + c.cycleLength, 0) / workCycles.length || 0)}d
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                    <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
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
                            placeholder="Search work cycles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Work Cycles Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">All Work Cycles</CardTitle>
                        <CardDescription>Configure work patterns, targets, and shift allocations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Cycle Length</TableHead>
                                    <TableHead>Target</TableHead>
                                    <TableHead>Detection</TableHead>
                                    <TableHead>Employees</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCycles.map((cycle) => (
                                    <TableRow key={cycle.id}>
                                        <TableCell className="font-mono font-medium">{cycle.code}</TableCell>
                                        <TableCell>{cycle.description}</TableCell>
                                        <TableCell>
                                            <span className="flex items-center gap-1">
                                                <RefreshCw className="w-4 h-4 text-muted-foreground" />
                                                {cycle.cycleLength} {cycle.cycleLengthType}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {cycle.targetHours}h / {cycle.targetType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className={
                                                    cycle.clockDetectionMethod === "directional"
                                                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                                        : "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                                                }
                                            >
                                                {cycle.clockDetectionMethod === "directional" ? "Directional" : "Auto"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-muted-foreground">{cycle.employeeCount}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    cycle.isActive
                                                        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400"
                                                        : "bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400"
                                                }
                                            >
                                                {cycle.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEditCycle(cycle)}
                                                    className="h-8 w-8 p-0"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDuplicateCycle(cycle)}
                                                    className="h-8 w-8 p-0"
                                                    title="Duplicate"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteCycle(cycle.id)}
                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
                                                    title="Delete"
                                                    disabled={cycle.employeeCount > 0}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredCycles.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                            No work cycles found. Create your first work cycle to get started.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Modal */}
            <WorkCycleFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setEditingCycle(null)
                }}
                onSave={handleSaveCycle}
                editingCycle={editingCycle}
            />
        </div>
    )
}
