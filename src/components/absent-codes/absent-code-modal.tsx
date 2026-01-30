"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
import type { AbsentCode } from "./absent-codes-screen"

const iconOptions = [
    { value: "🌴", label: "Palm Tree (Vacation)" },
    { value: "🏥", label: "Hospital (Sick)" },
    { value: "👨‍👩‍👧", label: "Family" },
    { value: "📅", label: "Calendar" },
    { value: "📚", label: "Books (Study)" },
    { value: "🏠", label: "Home" },
    { value: "✈️", label: "Airplane (Travel)" },
    { value: "💼", label: "Briefcase (Business)" },
    { value: "🎉", label: "Party (Celebration)" },
    { value: "⚡", label: "Lightning (Emergency)" },
]

type AbsentCodeModalProps = {
    isOpen: boolean
    onClose: () => void
    onSave: (code: Omit<AbsentCode, "id" | "isDefault" | "usageCount">) => void
    editingCode: AbsentCode | null
}

export function AbsentCodeModal({ isOpen, onClose, onSave, editingCode }: AbsentCodeModalProps) {
    const [code, setCode] = useState("")
    const [description, setDescription] = useState("")
    const [isPaid, setIsPaid] = useState(true)
    const [hasFixedHours, setHasFixedHours] = useState(true)
    const [fixedHours, setFixedHours] = useState<number>(8)
    const [icon, setIcon] = useState("🌴")
    const [errors, setErrors] = useState<{ code?: string; description?: string }>({})

    useEffect(() => {
        if (editingCode) {
            setCode(editingCode.code)
            setDescription(editingCode.description)
            setIsPaid(editingCode.isPaid)
            setHasFixedHours(editingCode.fixedHours !== null)
            setFixedHours(editingCode.fixedHours ?? 8)
            setIcon(editingCode.icon)
        } else {
            resetForm()
        }
    }, [editingCode, isOpen])

    const resetForm = () => {
        setCode("")
        setDescription("")
        setIsPaid(true)
        setHasFixedHours(true)
        setFixedHours(8)
        setIcon("🌴")
        setErrors({})
    }

    const validateForm = () => {
        const newErrors: { code?: string; description?: string } = {}

        if (!code.trim()) {
            newErrors.code = "Code is required"
        } else if (code.length > 10) {
            newErrors.code = "Code must be 10 characters or less"
        } else if (!/^[A-Z0-9_]+$/.test(code.toUpperCase())) {
            newErrors.code = "Code must contain only letters, numbers, and underscores"
        }

        if (!description.trim()) {
            newErrors.description = "Description is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        if (!validateForm()) return

        onSave({
            code: code.toUpperCase(),
            description,
            isPaid,
            fixedHours: hasFixedHours ? fixedHours : null,
            icon,
        })
        resetForm()
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{editingCode ? "Edit Absent Code" : "Add New Absent Code"}</DialogTitle>
                    <DialogDescription>
                        {editingCode
                            ? "Update the details of this absence code."
                            : "Create a new absence code for your organization."}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-5 py-4">
                    {/* Icon Selection */}
                    <div className="grid gap-2">
                        <Label htmlFor="icon">Icon</Label>
                        <Select value={icon} onValueChange={setIcon}>
                            <SelectTrigger>
                                <SelectValue>
                                    <span className="flex items-center gap-2">
                                        <span className="text-xl">{icon}</span>
                                        <span>{iconOptions.find((o) => o.value === icon)?.label}</span>
                                    </span>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {iconOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        <span className="flex items-center gap-2">
                                            <span className="text-xl">{option.value}</span>
                                            <span>{option.label}</span>
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Code */}
                    <div className="grid gap-2">
                        <Label htmlFor="code">
                            Code <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="code"
                            placeholder="e.g., ANNUAL, SICK"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            className={errors.code ? "border-red-500" : ""}
                            disabled={editingCode?.isDefault}
                        />
                        {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                        {editingCode?.isDefault && (
                            <p className="text-sm text-muted-foreground">Default codes cannot be renamed</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="grid gap-2">
                        <Label htmlFor="description">
                            Description <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="description"
                            placeholder="e.g., Annual Leave"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={errors.description ? "border-red-500" : ""}
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>

                    {/* Paid/Unpaid Toggle */}
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="isPaid" className="font-medium">
                                Paid Leave
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Employee receives pay during this absence
                            </p>
                        </div>
                        <Switch id="isPaid" checked={isPaid} onCheckedChange={setIsPaid} />
                    </div>

                    {/* Fixed Hours */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="hasFixedHours" className="font-medium">
                                    Fixed Hours Allocation
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Automatically allocate a set number of hours
                                </p>
                            </div>
                            <Switch
                                id="hasFixedHours"
                                checked={hasFixedHours}
                                onCheckedChange={setHasFixedHours}
                            />
                        </div>

                        {hasFixedHours && (
                            <div className="grid gap-2 ml-4">
                                <Label htmlFor="fixedHours">Hours per day</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="fixedHours"
                                        type="number"
                                        min={0.5}
                                        max={24}
                                        step={0.5}
                                        value={fixedHours}
                                        onChange={(e) => setFixedHours(parseFloat(e.target.value) || 0)}
                                        className="w-24"
                                    />
                                    <span className="text-sm text-muted-foreground">hours</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        {editingCode ? "Save Changes" : "Create Code"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
