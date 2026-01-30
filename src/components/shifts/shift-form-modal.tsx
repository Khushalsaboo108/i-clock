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
import { Plus, Trash2, Clock, AlertCircle } from "lucide-react"
import type { Shift, ShiftRule } from "./shifts-screen"

type CalculationRule = {
    id: string
    condition: "if-worked" | "set-column" | "min-max"
    sourceColumn: string
    sourceHours: number
    action: "give-extra" | "deduct" | "set-to" | "min" | "max"
    targetColumn: string
    targetValue: number
}

type ShiftFormModalProps = {
    isOpen: boolean
    onClose: () => void
    onSave: (shift: Omit<Shift, "id" | "employeeCount" | "createdAt" | "updatedAt">) => void
    editingShift: Shift | null
}

const emptyRule: Omit<ShiftRule, "id"> = {
    type: "primary",
    name: "",
    startTime: "09:00",
    endTime: "17:00",
    gracePeriod: 5,
    lateFlag: true,
    earlyFlag: true,
    payRate: "Normal",
    holidayPayRate: "Double",
    isPaid: true,
}

const payRateOptions = ["Normal", "Time-and-Half", "Double", "Triple", "Night Differential", "None"]
const columnOptions = ["Normal", "Overtime", "Double-Time", "Night", "Holiday", "Sick", "Leave"]
const balanceRuleOptions = [
    { value: "carry-forward", label: "Carry Forward" },
    { value: "reset", label: "Reset Each Period" },
    { value: "cap", label: "Cap at Maximum" },
]
const calculationOptions = [
    { value: "clock-to-clock", label: "Clock to Clock" },
    { value: "first-to-last", label: "First to Last" },
]

export function ShiftFormModal({ isOpen, onClose, onSave, editingShift }: ShiftFormModalProps) {
    const [activeTab, setActiveTab] = useState("basic")

    // Basic Info
    const [code, setCode] = useState("")
    const [description, setDescription] = useState("")
    const [targetHours, setTargetHours] = useState(8)
    const [roundingMinutes, setRoundingMinutes] = useState(15)
    const [balanceRule, setBalanceRule] = useState<"carry-forward" | "reset" | "cap">("carry-forward")
    const [calculationMethod, setCalculationMethod] = useState<"clock-to-clock" | "first-to-last">("clock-to-clock")
    const [isActive, setIsActive] = useState(true)

    // Rules
    const [rules, setRules] = useState<ShiftRule[]>([])

    // Calculation Rules
    const [calculationRules, setCalculationRules] = useState<CalculationRule[]>([])
    const [minShiftTime, setMinShiftTime] = useState(0)
    const [holidayMultiplier, setHolidayMultiplier] = useState(1.5)
    const [showFirstLastOnly, setShowFirstLastOnly] = useState(false)

    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (editingShift) {
            setCode(editingShift.code)
            setDescription(editingShift.description)
            setTargetHours(editingShift.targetHours)
            setRoundingMinutes(editingShift.roundingMinutes)
            setBalanceRule(editingShift.balanceRule)
            setCalculationMethod(editingShift.calculationMethod)
            setIsActive(editingShift.isActive)
            setRules(editingShift.rules)
        } else {
            resetForm()
        }
        setActiveTab("basic")
    }, [editingShift, isOpen])

    const resetForm = () => {
        setCode("")
        setDescription("")
        setTargetHours(8)
        setRoundingMinutes(15)
        setBalanceRule("carry-forward")
        setCalculationMethod("clock-to-clock")
        setIsActive(true)
        setRules([])
        setCalculationRules([])
        setMinShiftTime(0)
        setHolidayMultiplier(1.5)
        setShowFirstLastOnly(false)
        setErrors({})
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!code.trim()) newErrors.code = "Code is required"
        if (!description.trim()) newErrors.description = "Description is required"
        if (targetHours <= 0) newErrors.targetHours = "Target hours must be positive"
        if (rules.filter((r) => r.type === "primary").length === 0) {
            newErrors.rules = "At least one primary rule is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleAddRule = (type: "primary" | "extra" | "deduct") => {
        const newRule: ShiftRule = {
            ...emptyRule,
            id: `rule-${Date.now()}`,
            type,
            name: type === "primary" ? "Primary Shift" : type === "deduct" ? "Break" : "Extra Hours",
            isPaid: type !== "deduct",
            allowedTime: type === "deduct" ? 60 : undefined,
        }
        setRules([...rules, newRule])
    }

    const handleUpdateRule = (id: string, updates: Partial<ShiftRule>) => {
        setRules(rules.map((r) => (r.id === id ? { ...r, ...updates } : r)))
    }

    const handleDeleteRule = (id: string) => {
        setRules(rules.filter((r) => r.id !== id))
    }

    const handleSubmit = () => {
        if (!validateForm()) {
            if (errors.rules) setActiveTab("rules")
            return
        }

        onSave({
            code: code.toUpperCase(),
            description,
            targetHours,
            roundingMinutes,
            balanceRule,
            calculationMethod,
            isActive,
            rules,
        })
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    const primaryRules = rules.filter((r) => r.type === "primary")
    const extraRules = rules.filter((r) => r.type === "extra")
    const deductRules = rules.filter((r) => r.type === "deduct")

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingShift ? "Edit Shift" : "Create New Shift"}</DialogTitle>
                    <DialogDescription>
                        Configure shift pattern, rules, and calculation methods
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="basic">Basic</TabsTrigger>
                        <TabsTrigger value="rules" className="relative">
                            Rules
                            {errors.rules && (
                                <AlertCircle className="w-3 h-3 text-red-500 absolute -top-1 -right-1" />
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="calculation">Calculation</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    {/* Basic Info Tab */}
                    <TabsContent value="basic" className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="code">
                                    Shift Code <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="code"
                                    placeholder="e.g., DAY-STD"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    className={errors.code ? "border-red-500" : ""}
                                />
                                {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="targetHours">Target Hours</Label>
                                <Input
                                    id="targetHours"
                                    type="number"
                                    min={0.5}
                                    max={24}
                                    step={0.5}
                                    value={targetHours}
                                    onChange={(e) => setTargetHours(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">
                                Description <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="description"
                                placeholder="e.g., Standard Day Shift"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className={errors.description ? "border-red-500" : ""}
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Calculation Method</Label>
                                <Select value={calculationMethod} onValueChange={(v: "clock-to-clock" | "first-to-last") => setCalculationMethod(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {calculationOptions.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Rounding (minutes)</Label>
                                <Select value={String(roundingMinutes)} onValueChange={(v) => setRoundingMinutes(parseInt(v))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[1, 5, 10, 15, 30, 60].map((m) => (
                                            <SelectItem key={m} value={String(m)}>
                                                {m} minute{m !== 1 ? "s" : ""}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <Label className="font-medium">Active Status</Label>
                                <p className="text-sm text-muted-foreground">Enable this shift for assignment</p>
                            </div>
                            <Switch checked={isActive} onCheckedChange={setIsActive} />
                        </div>
                    </TabsContent>

                    {/* Rules Tab */}
                    <TabsContent value="rules" className="space-y-4 mt-4">
                        {errors.rules && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-sm">{errors.rules}</span>
                            </div>
                        )}

                        {/* Primary Rules */}
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base">Primary Rules</CardTitle>
                                        <CardDescription>Main shift time windows</CardDescription>
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => handleAddRule("primary")}>
                                        <Plus className="w-4 h-4 mr-1" /> Add
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {primaryRules.map((rule) => (
                                    <RuleCard key={rule.id} rule={rule} onUpdate={handleUpdateRule} onDelete={handleDeleteRule} />
                                ))}
                                {primaryRules.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No primary rules. Add at least one.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Deduct Rules */}
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base">Deduct Rules</CardTitle>
                                        <CardDescription>Breaks and unpaid time deductions</CardDescription>
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => handleAddRule("deduct")}>
                                        <Plus className="w-4 h-4 mr-1" /> Add
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {deductRules.map((rule) => (
                                    <RuleCard key={rule.id} rule={rule} onUpdate={handleUpdateRule} onDelete={handleDeleteRule} isDeduct />
                                ))}
                                {deductRules.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No deduct rules configured.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Extra Rules */}
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base">Extra Rules</CardTitle>
                                        <CardDescription>Overtime and additional pay rules</CardDescription>
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => handleAddRule("extra")}>
                                        <Plus className="w-4 h-4 mr-1" /> Add
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {extraRules.map((rule) => (
                                    <RuleCard key={rule.id} rule={rule} onUpdate={handleUpdateRule} onDelete={handleDeleteRule} />
                                ))}
                                {extraRules.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No extra rules configured.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Calculation Tab */}
                    <TabsContent value="calculation" className="space-y-4 mt-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base">Calculation Rules</CardTitle>
                                        <CardDescription>Conditional time allocation rules</CardDescription>
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => {
                                        const newRule: CalculationRule = {
                                            id: `calc-${Date.now()}`,
                                            condition: "if-worked",
                                            sourceColumn: "Normal",
                                            sourceHours: 8,
                                            action: "give-extra",
                                            targetColumn: "Overtime",
                                            targetValue: 1,
                                        }
                                        setCalculationRules([...calculationRules, newRule])
                                    }}>
                                        <Plus className="w-4 h-4 mr-1" /> Add Rule
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {calculationRules.map((rule) => (
                                    <div key={rule.id} className="border rounded-lg p-3 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Badge variant="outline">Calculation Rule</Badge>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setCalculationRules(calculationRules.filter(r => r.id !== rule.id))}
                                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2 items-center">
                                            <span className="text-sm">If worked</span>
                                            <Input
                                                type="number"
                                                min={0}
                                                value={rule.sourceHours}
                                                onChange={(e) => {
                                                    setCalculationRules(calculationRules.map(r =>
                                                        r.id === rule.id ? { ...r, sourceHours: parseFloat(e.target.value) || 0 } : r
                                                    ))
                                                }}
                                                className="h-8"
                                            />
                                            <span className="text-sm">hrs in</span>
                                            <Select
                                                value={rule.sourceColumn}
                                                onValueChange={(v) => {
                                                    setCalculationRules(calculationRules.map(r =>
                                                        r.id === rule.id ? { ...r, sourceColumn: v } : r
                                                    ))
                                                }}
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {columnOptions.map((c) => (
                                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2 items-center">
                                            <Select
                                                value={rule.action}
                                                onValueChange={(v: CalculationRule["action"]) => {
                                                    setCalculationRules(calculationRules.map(r =>
                                                        r.id === rule.id ? { ...r, action: v } : r
                                                    ))
                                                }}
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="give-extra">Give extra</SelectItem>
                                                    <SelectItem value="deduct">Deduct</SelectItem>
                                                    <SelectItem value="set-to">Set to</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Input
                                                type="number"
                                                min={0}
                                                step={0.5}
                                                value={rule.targetValue}
                                                onChange={(e) => {
                                                    setCalculationRules(calculationRules.map(r =>
                                                        r.id === rule.id ? { ...r, targetValue: parseFloat(e.target.value) || 0 } : r
                                                    ))
                                                }}
                                                className="h-8"
                                            />
                                            <span className="text-sm">hrs in</span>
                                            <Select
                                                value={rule.targetColumn}
                                                onValueChange={(v) => {
                                                    setCalculationRules(calculationRules.map(r =>
                                                        r.id === rule.id ? { ...r, targetColumn: v } : r
                                                    ))
                                                }}
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {columnOptions.map((c) => (
                                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                ))}
                                {calculationRules.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No calculation rules. Add rules for conditional time allocation.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Minimum Shift Time (minutes)</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={minShiftTime}
                                    onChange={(e) => setMinShiftTime(parseInt(e.target.value) || 0)}
                                />
                                <p className="text-xs text-muted-foreground">Min time required for shift allocation</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Public Holiday Multiplier</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={5}
                                    step={0.5}
                                    value={holidayMultiplier}
                                    onChange={(e) => setHolidayMultiplier(parseFloat(e.target.value) || 1)}
                                />
                                <p className="text-xs text-muted-foreground">Time multiplier on public holidays</p>
                            </div>
                        </div>

                        {calculationMethod === "first-to-last" && (
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div>
                                    <Label className="font-medium">Show First & Last Only</Label>
                                    <p className="text-sm text-muted-foreground">Display only first and last clock times</p>
                                </div>
                                <Switch checked={showFirstLastOnly} onCheckedChange={setShowFirstLastOnly} />
                            </div>
                        )}
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label>Balance Rule</Label>
                            <Select value={balanceRule} onValueChange={(v: "carry-forward" | "reset" | "cap") => setBalanceRule(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {balanceRuleOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-sm text-muted-foreground">
                                {balanceRule === "carry-forward" && "Hours over/under target carry to next period"}
                                {balanceRule === "reset" && "Balance resets at the start of each period"}
                                {balanceRule === "cap" && "Balance is capped at maximum allowed"}
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter className="mt-6">
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        {editingShift ? "Save Changes" : "Create Shift"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// Rule Card Component
function RuleCard({
    rule,
    onUpdate,
    onDelete,
    isDeduct = false,
}: {
    rule: ShiftRule
    onUpdate: (id: string, updates: Partial<ShiftRule>) => void
    onDelete: (id: string) => void
    isDeduct?: boolean
}) {
    const payRateOptions = ["Normal", "Time-and-Half", "Double", "Triple", "Night Differential", "None"]

    return (
        <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
                <Input
                    value={rule.name}
                    onChange={(e) => onUpdate(rule.id, { name: e.target.value })}
                    className="max-w-[200px] font-medium"
                    placeholder="Rule name"
                />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(rule.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <Label className="text-xs">Start Time</Label>
                    <Input
                        type="time"
                        value={rule.startTime}
                        onChange={(e) => onUpdate(rule.id, { startTime: e.target.value })}
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">End Time</Label>
                    <Input
                        type="time"
                        value={rule.endTime}
                        onChange={(e) => onUpdate(rule.id, { endTime: e.target.value })}
                    />
                </div>
            </div>

            {!isDeduct && (
                <>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs">Grace (min)</Label>
                            <Input
                                type="number"
                                min={0}
                                max={60}
                                value={rule.gracePeriod}
                                onChange={(e) => onUpdate(rule.id, { gracePeriod: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Pay Rate</Label>
                            <Select value={rule.payRate} onValueChange={(v) => onUpdate(rule.id, { payRate: v })}>
                                <SelectTrigger className="h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {payRateOptions.map((r) => (
                                        <SelectItem key={r} value={r}>{r}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Holiday Rate</Label>
                            <Select value={rule.holidayPayRate} onValueChange={(v) => onUpdate(rule.id, { holidayPayRate: v })}>
                                <SelectTrigger className="h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {payRateOptions.map((r) => (
                                        <SelectItem key={r} value={r}>{r}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={rule.lateFlag}
                                onCheckedChange={(v) => onUpdate(rule.id, { lateFlag: v })}
                            />
                            <Label className="text-sm">Late Flag</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={rule.earlyFlag}
                                onCheckedChange={(v) => onUpdate(rule.id, { earlyFlag: v })}
                            />
                            <Label className="text-sm">Early Flag</Label>
                        </div>
                    </div>
                </>
            )}

            {isDeduct && (
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs">Allowed Time (min)</Label>
                        <Input
                            type="number"
                            min={0}
                            value={rule.allowedTime || 0}
                            onChange={(e) => onUpdate(rule.id, { allowedTime: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                    <div className="flex items-center gap-2 pt-5">
                        <Switch
                            checked={rule.isPaid}
                            onCheckedChange={(v) => onUpdate(rule.id, { isPaid: v })}
                        />
                        <Label className="text-sm">Paid Break</Label>
                    </div>
                </div>
            )}
        </div>
    )
}
