"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus, X, Calendar } from "lucide-react"
import type { WorkCycle, ShiftAllocation } from "./work-cycles-screen"

type WorkCycleFormModalProps = {
    isOpen: boolean
    onClose: () => void
    onSave: (cycle: Omit<WorkCycle, "id" | "employeeCount" | "createdAt" | "updatedAt">) => void
    editingCycle: WorkCycle | null
}

const availableShifts = [
    { code: "DAY-STD", description: "Standard Day Shift" },
    { code: "NIGHT-STD", description: "Standard Night Shift" },
    { code: "FLEX-8", description: "Flexible 8-Hour" },
    { code: "PART-4", description: "Part-Time 4 Hours" },
]

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export function WorkCycleFormModal({ isOpen, onClose, onSave, editingCycle }: WorkCycleFormModalProps) {
    const [activeTab, setActiveTab] = useState("basic")

    // Basic Info
    const [code, setCode] = useState("")
    const [description, setDescription] = useState("")
    const [startDate, setStartDate] = useState("")
    const [cycleLength, setCycleLength] = useState(7)
    const [cycleLengthType, setCycleLengthType] = useState<"days" | "weeks">("days")
    const [isActive, setIsActive] = useState(true)

    // Detection & Targets
    const [clockDetectionMethod, setClockDetectionMethod] = useState<"directional" | "auto-detection">("auto-detection")
    const [targetType, setTargetType] = useState<"weekly" | "fortnightly" | "monthly">("weekly")
    const [targetHours, setTargetHours] = useState(40)

    // Limits & Balance
    const [columnLimit, setColumnLimit] = useState<number | null>(null)
    const [hasColumnLimit, setHasColumnLimit] = useState(false)
    const [overflowHandling, setOverflowHandling] = useState<"carry-forward" | "cap" | "lose">("carry-forward")
    const [balanceRule, setBalanceRule] = useState<"carry-forward" | "reset" | "cap">("carry-forward")

    // Shift Allocations
    const [shiftAllocations, setShiftAllocations] = useState<ShiftAllocation[]>([])

    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (editingCycle) {
            setCode(editingCycle.code)
            setDescription(editingCycle.description)
            setStartDate(editingCycle.startDate)
            setCycleLength(editingCycle.cycleLength)
            setCycleLengthType(editingCycle.cycleLengthType)
            setClockDetectionMethod(editingCycle.clockDetectionMethod)
            setTargetType(editingCycle.targetType)
            setTargetHours(editingCycle.targetHours)
            setColumnLimit(editingCycle.columnLimit)
            setHasColumnLimit(editingCycle.columnLimit !== null)
            setOverflowHandling(editingCycle.overflowHandling)
            setBalanceRule(editingCycle.balanceRule)
            setIsActive(editingCycle.isActive)
            setShiftAllocations(editingCycle.shiftAllocations)
        } else {
            resetForm()
        }
        setActiveTab("basic")
    }, [editingCycle, isOpen])

    const resetForm = () => {
        setCode("")
        setDescription("")
        setStartDate(new Date().toISOString().split("T")[0])
        setCycleLength(7)
        setCycleLengthType("days")
        setClockDetectionMethod("auto-detection")
        setTargetType("weekly")
        setTargetHours(40)
        setColumnLimit(null)
        setHasColumnLimit(false)
        setOverflowHandling("carry-forward")
        setBalanceRule("carry-forward")
        setIsActive(true)
        setShiftAllocations([])
        setErrors({})
    }

    // Auto-scale target hours based on type
    useEffect(() => {
        if (targetType === "weekly") setTargetHours(40)
        else if (targetType === "fortnightly") setTargetHours(80)
        else if (targetType === "monthly") setTargetHours(160)
    }, [targetType])

    // Initialize shift allocations based on cycle length
    useEffect(() => {
        if (shiftAllocations.length === 0 && cycleLength > 0) {
            const newAllocations: ShiftAllocation[] = []
            for (let i = 1; i <= cycleLength; i++) {
                newAllocations.push({ day: i, shiftCodes: [] })
            }
            setShiftAllocations(newAllocations)
        } else if (cycleLength !== shiftAllocations.length) {
            // Adjust allocations if cycle length changes
            if (cycleLength > shiftAllocations.length) {
                const additional: ShiftAllocation[] = []
                for (let i = shiftAllocations.length + 1; i <= cycleLength; i++) {
                    additional.push({ day: i, shiftCodes: [] })
                }
                setShiftAllocations([...shiftAllocations, ...additional])
            } else {
                setShiftAllocations(shiftAllocations.slice(0, cycleLength))
            }
        }
    }, [cycleLength])

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!code.trim()) newErrors.code = "Code is required"
        if (!description.trim()) newErrors.description = "Description is required"
        if (!startDate) newErrors.startDate = "Start date is required"
        if (cycleLength <= 0) newErrors.cycleLength = "Cycle length must be positive"
        if (targetHours <= 0) newErrors.targetHours = "Target hours must be positive"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleAddShiftToDay = (dayIndex: number, shiftCode: string) => {
        setShiftAllocations(
            shiftAllocations.map((alloc, i) =>
                i === dayIndex && !alloc.shiftCodes.includes(shiftCode)
                    ? { ...alloc, shiftCodes: [...alloc.shiftCodes, shiftCode] }
                    : alloc
            )
        )
    }

    const handleRemoveShiftFromDay = (dayIndex: number, shiftCode: string) => {
        setShiftAllocations(
            shiftAllocations.map((alloc, i) =>
                i === dayIndex
                    ? { ...alloc, shiftCodes: alloc.shiftCodes.filter((s) => s !== shiftCode) }
                    : alloc
            )
        )
    }

    const handleSubmit = () => {
        if (!validateForm()) return

        onSave({
            code: code.toUpperCase(),
            description,
            startDate,
            cycleLength,
            cycleLengthType,
            clockDetectionMethod,
            targetType,
            targetHours,
            columnLimit: hasColumnLimit ? columnLimit : null,
            overflowHandling,
            balanceRule,
            isActive,
            shiftAllocations,
        })
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingCycle ? "Edit Work Cycle" : "Create New Work Cycle"}</DialogTitle>
                    <DialogDescription>
                        Configure work cycle pattern, targets, and shift allocations
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="basic">Basic</TabsTrigger>
                        <TabsTrigger value="targets">Targets</TabsTrigger>
                        <TabsTrigger value="rules">Rules</TabsTrigger>
                        <TabsTrigger value="shifts">Shifts</TabsTrigger>
                    </TabsList>

                    {/* Basic Info Tab */}
                    <TabsContent value="basic" className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="code">
                                    Cycle Code <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="code"
                                    placeholder="e.g., WC-STANDARD"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    className={errors.code ? "border-red-500" : ""}
                                />
                                {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="startDate">
                                    Start Date <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className={errors.startDate ? "border-red-500" : ""}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">
                                Description <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="description"
                                placeholder="e.g., Standard 5-Day Work Week"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className={errors.description ? "border-red-500" : ""}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Cycle Length</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        min={1}
                                        max={365}
                                        value={cycleLength}
                                        onChange={(e) => setCycleLength(parseInt(e.target.value) || 7)}
                                        className="w-20"
                                    />
                                    <Select value={cycleLengthType} onValueChange={(v: "days" | "weeks") => setCycleLengthType(v)}>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="days">Days</SelectItem>
                                            <SelectItem value="weeks">Weeks</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Clock Detection Method</Label>
                                <Select
                                    value={clockDetectionMethod}
                                    onValueChange={(v: "directional" | "auto-detection") => setClockDetectionMethod(v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="directional">Directional (Reader decides IN/OUT)</SelectItem>
                                        <SelectItem value="auto-detection">Auto-detection (First=IN, alternating)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <Label className="font-medium">Active Status</Label>
                                <p className="text-sm text-muted-foreground">Enable this work cycle for assignment</p>
                            </div>
                            <Switch checked={isActive} onCheckedChange={setIsActive} />
                        </div>
                    </TabsContent>

                    {/* Targets Tab */}
                    <TabsContent value="targets" className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Target Type</Label>
                                <Select
                                    value={targetType}
                                    onValueChange={(v: "weekly" | "fortnightly" | "monthly") => setTargetType(v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="fortnightly">Fortnightly</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Target Hours</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={500}
                                    value={targetHours}
                                    onChange={(e) => setTargetHours(parseInt(e.target.value) || 0)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Auto-scaled: Weekly=40h, Fortnightly=80h, Monthly=160h
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div>
                                    <Label className="font-medium">Column Limit</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Maximum hours that can be recorded per day
                                    </p>
                                </div>
                                <Switch checked={hasColumnLimit} onCheckedChange={setHasColumnLimit} />
                            </div>

                            {hasColumnLimit && (
                                <div className="ml-4 space-y-2">
                                    <Label>Maximum Hours per Day</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={24}
                                        value={columnLimit || 12}
                                        onChange={(e) => setColumnLimit(parseInt(e.target.value) || 12)}
                                        className="w-32"
                                    />
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Rules Tab */}
                    <TabsContent value="rules" className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label>Overflow Handling</Label>
                            <Select
                                value={overflowHandling}
                                onValueChange={(v: "carry-forward" | "cap" | "lose") => setOverflowHandling(v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="carry-forward">Carry Forward to Next Period</SelectItem>
                                    <SelectItem value="cap">Cap at Maximum</SelectItem>
                                    <SelectItem value="lose">Lose Excess Hours</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-sm text-muted-foreground">
                                What happens when hours exceed the column limit
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>Balance Rule</Label>
                            <Select
                                value={balanceRule}
                                onValueChange={(v: "carry-forward" | "reset" | "cap") => setBalanceRule(v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="carry-forward">Carry Forward</SelectItem>
                                    <SelectItem value="reset">Reset Each Period</SelectItem>
                                    <SelectItem value="cap">Cap at Maximum</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-sm text-muted-foreground">
                                How to handle hour balance at end of cycle
                            </p>
                        </div>
                    </TabsContent>

                    {/* Shifts Tab */}
                    <TabsContent value="shifts" className="space-y-4 mt-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Shift Allocation Calendar
                                </CardTitle>
                                <CardDescription>
                                    Assign shifts to each day of the cycle. Multiple shifts per day are allowed.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {shiftAllocations.slice(0, Math.min(14, cycleLength)).map((alloc, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
                                        >
                                            <div className="w-16 font-medium text-sm">
                                                {cycleLength <= 7
                                                    ? dayNames[index % 7]
                                                    : `Day ${index + 1}`}
                                            </div>
                                            <div className="flex-1 flex flex-wrap gap-2">
                                                {alloc.shiftCodes.map((shiftCode) => (
                                                    <Badge
                                                        key={shiftCode}
                                                        variant="secondary"
                                                        className="flex items-center gap-1"
                                                    >
                                                        {shiftCode}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon-sm"
                                                            onClick={() => handleRemoveShiftFromDay(index, shiftCode)}
                                                            className="ml-1 h-4 w-4 rounded-full p-0 hover:text-red-500 hover:bg-transparent"
                                                        >
                                                            <X className="w-3 h-3" />
                                                            <span className="sr-only">Remove {shiftCode}</span>
                                                        </Button>
                                                    </Badge>
                                                ))}
                                                {alloc.shiftCodes.length === 0 && (
                                                    <span className="text-sm text-muted-foreground">No shifts (Off day)</span>
                                                )}
                                            </div>
                                            <Select
                                                value=""
                                                onValueChange={(v) => handleAddShiftToDay(index, v)}
                                            >
                                                <SelectTrigger className="w-[140px]">
                                                    <SelectValue placeholder="Add shift..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableShifts
                                                        .filter((s) => !alloc.shiftCodes.includes(s.code))
                                                        .map((shift) => (
                                                            <SelectItem key={shift.code} value={shift.code}>
                                                                {shift.code}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ))}
                                    {cycleLength > 14 && (
                                        <p className="text-sm text-muted-foreground text-center py-2">
                                            Showing first 14 days. Full cycle has {cycleLength} days.
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <DialogFooter className="mt-6">
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        {editingCycle ? "Save Changes" : "Create Work Cycle"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
