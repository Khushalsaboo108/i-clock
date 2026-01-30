"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, AlertTriangle, FileWarning, Bell, BellOff } from "lucide-react"

type DisciplinaryRecord = {
    id: string
    date: string
    type: "verbal-warning" | "written-warning" | "final-warning" | "suspension" | "termination" | "other"
    description: string
    issuedBy: string
    expiryDate: string | null
    notifyEmployee: boolean
    notifyManager: boolean
    status: "active" | "expired" | "resolved"
    attachments: string[]
    notes: string
}

const typeLabels: Record<DisciplinaryRecord["type"], { label: string; color: string }> = {
    "verbal-warning": { label: "Verbal Warning", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
    "written-warning": { label: "Written Warning", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" },
    "final-warning": { label: "Final Warning", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
    "suspension": { label: "Suspension", color: "bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-300" },
    "termination": { label: "Termination", color: "bg-red-300 text-red-900 dark:bg-red-900/70 dark:text-red-200" },
    "other": { label: "Other", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400" },
}

const mockRecords: DisciplinaryRecord[] = [
    {
        id: "1",
        date: "2024-09-15",
        type: "verbal-warning",
        description: "Late arrival on multiple occasions during September",
        issuedBy: "Jane Doe (HR Manager)",
        expiryDate: "2025-03-15",
        notifyEmployee: true,
        notifyManager: true,
        status: "active",
        attachments: [],
        notes: "Employee acknowledged and committed to improvement",
    },
    {
        id: "2",
        date: "2024-06-20",
        type: "written-warning",
        description: "Failure to follow safety protocols in warehouse area",
        issuedBy: "John Smith (Safety Officer)",
        expiryDate: "2024-12-20",
        notifyEmployee: true,
        notifyManager: true,
        status: "expired",
        attachments: ["incident-report.pdf"],
        notes: "Completed mandatory safety training on 2024-07-01",
    },
]

export function DisciplinaryRecordsTab() {
    const [records, setRecords] = useState<DisciplinaryRecord[]>(mockRecords)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingRecord, setEditingRecord] = useState<DisciplinaryRecord | null>(null)

    const handleAddRecord = () => {
        setEditingRecord(null)
        setIsModalOpen(true)
    }

    const handleEditRecord = (record: DisciplinaryRecord) => {
        setEditingRecord(record)
        setIsModalOpen(true)
    }

    const handleDeleteRecord = (id: string) => {
        if (confirm("Are you sure you want to delete this disciplinary record?")) {
            setRecords(records.filter((r) => r.id !== id))
        }
    }

    const handleSaveRecord = (recordData: Omit<DisciplinaryRecord, "id">) => {
        if (editingRecord) {
            setRecords(
                records.map((r) =>
                    r.id === editingRecord.id ? { ...r, ...recordData } : r
                )
            )
        } else {
            const newRecord: DisciplinaryRecord = {
                ...recordData,
                id: `${Date.now()}`,
            }
            setRecords([...records, newRecord])
        }
        setIsModalOpen(false)
        setEditingRecord(null)
    }

    const getStatusBadge = (status: DisciplinaryRecord["status"]) => {
        switch (status) {
            case "active":
                return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Active</Badge>
            case "expired":
                return <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">Expired</Badge>
            case "resolved":
                return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Resolved</Badge>
        }
    }

    const activeRecords = records.filter((r) => r.status === "active")

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">Disciplinary Records</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage employee disciplinary actions and warnings
                    </p>
                </div>
                <Button onClick={handleAddRecord} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Record
                </Button>
            </div>

            {/* Active Warnings Alert */}
            {activeRecords.length > 0 && (
                <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <div>
                        <p className="font-medium text-amber-800 dark:text-amber-300">
                            {activeRecords.length} Active Warning{activeRecords.length !== 1 ? "s" : ""}
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-400">
                            Employee has {activeRecords.length} active disciplinary record{activeRecords.length !== 1 ? "s" : ""} on file
                        </p>
                    </div>
                </div>
            )}

            {/* Records List */}
            <div className="space-y-4">
                {records.length === 0 ? (
                    <Card className="p-8 text-center">
                        <FileWarning className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No disciplinary records found</p>
                        <Button variant="outline" className="mt-4" onClick={handleAddRecord}>
                            Add First Record
                        </Button>
                    </Card>
                ) : (
                    records.map((record) => (
                        <Card key={record.id} className="p-5">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Badge className={typeLabels[record.type].color}>
                                            {typeLabels[record.type].label}
                                        </Badge>
                                        {getStatusBadge(record.status)}
                                        <span className="text-sm text-muted-foreground">{record.date}</span>
                                    </div>
                                    <p className="text-foreground mb-2">{record.description}</p>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        <p>Issued by: {record.issuedBy}</p>
                                        {record.expiryDate && <p>Expires: {record.expiryDate}</p>}
                                        {record.notes && <p className="italic">&quot;{record.notes}&quot;</p>}
                                    </div>
                                    <div className="flex items-center gap-4 mt-3">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            {record.notifyEmployee ? (
                                                <Bell className="w-3 h-3" />
                                            ) : (
                                                <BellOff className="w-3 h-3" />
                                            )}
                                            Employee notifications {record.notifyEmployee ? "on" : "off"}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            {record.notifyManager ? (
                                                <Bell className="w-3 h-3" />
                                            ) : (
                                                <BellOff className="w-3 h-3" />
                                            )}
                                            Manager notifications {record.notifyManager ? "on" : "off"}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 ml-4">
                                    <Button variant="ghost" size="sm" onClick={() => handleEditRecord(record)}>
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteRecord(record.id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Add/Edit Modal */}
            <DisciplinaryRecordModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setEditingRecord(null)
                }}
                onSave={handleSaveRecord}
                editingRecord={editingRecord}
            />
        </div>
    )
}

// Modal Component
function DisciplinaryRecordModal({
    isOpen,
    onClose,
    onSave,
    editingRecord,
}: {
    isOpen: boolean
    onClose: () => void
    onSave: (record: Omit<DisciplinaryRecord, "id">) => void
    editingRecord: DisciplinaryRecord | null
}) {
    const [date, setDate] = useState("")
    const [type, setType] = useState<DisciplinaryRecord["type"]>("verbal-warning")
    const [description, setDescription] = useState("")
    const [issuedBy, setIssuedBy] = useState("")
    const [expiryDate, setExpiryDate] = useState("")
    const [hasExpiry, setHasExpiry] = useState(true)
    const [notifyEmployee, setNotifyEmployee] = useState(true)
    const [notifyManager, setNotifyManager] = useState(true)
    const [status, setStatus] = useState<DisciplinaryRecord["status"]>("active")
    const [notes, setNotes] = useState("")

    useState(() => {
        if (editingRecord) {
            setDate(editingRecord.date)
            setType(editingRecord.type)
            setDescription(editingRecord.description)
            setIssuedBy(editingRecord.issuedBy)
            setExpiryDate(editingRecord.expiryDate || "")
            setHasExpiry(editingRecord.expiryDate !== null)
            setNotifyEmployee(editingRecord.notifyEmployee)
            setNotifyManager(editingRecord.notifyManager)
            setStatus(editingRecord.status)
            setNotes(editingRecord.notes)
        } else {
            setDate(new Date().toISOString().split("T")[0])
            setType("verbal-warning")
            setDescription("")
            setIssuedBy("")
            setExpiryDate("")
            setHasExpiry(true)
            setNotifyEmployee(true)
            setNotifyManager(true)
            setStatus("active")
            setNotes("")
        }
    })

    const handleSubmit = () => {
        onSave({
            date,
            type,
            description,
            issuedBy,
            expiryDate: hasExpiry ? expiryDate : null,
            notifyEmployee,
            notifyManager,
            status,
            attachments: [],
            notes,
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {editingRecord ? "Edit Disciplinary Record" : "Add Disciplinary Record"}
                    </DialogTitle>
                    <DialogDescription>
                        Document disciplinary actions and configure notification settings
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Date *</Label>
                            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Type *</Label>
                            <Select value={type} onValueChange={(v: DisciplinaryRecord["type"]) => setType(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(typeLabels).map(([key, { label }]) => (
                                        <SelectItem key={key} value={key}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Description *</Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the incident or reason for disciplinary action..."
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Issued By *</Label>
                        <Input
                            value={issuedBy}
                            onChange={(e) => setIssuedBy(e.target.value)}
                            placeholder="e.g., Jane Doe (HR Manager)"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="hasExpiry"
                                    checked={hasExpiry}
                                    onCheckedChange={(v) => setHasExpiry(v === true)}
                                />
                                <Label htmlFor="hasExpiry">Has Expiry Date</Label>
                            </div>
                            {hasExpiry && (
                                <Input
                                    type="date"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                />
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={status} onValueChange={(v: DisciplinaryRecord["status"]) => setStatus(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-3 rounded-lg border p-4">
                        <Label className="font-medium">Notifications</Label>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="notifyEmployee"
                                checked={notifyEmployee}
                                onCheckedChange={(v) => setNotifyEmployee(v === true)}
                            />
                            <Label htmlFor="notifyEmployee" className="font-normal">
                                Send notification to employee
                            </Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="notifyManager"
                                checked={notifyManager}
                                onCheckedChange={(v) => setNotifyManager(v === true)}
                            />
                            <Label htmlFor="notifyManager" className="font-normal">
                                Send notification to manager
                            </Label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Additional notes or follow-up actions..."
                            rows={2}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        {editingRecord ? "Save Changes" : "Add Record"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
