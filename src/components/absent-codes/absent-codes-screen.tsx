"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Clock, DollarSign, CalendarDays, Heart, Users } from "lucide-react"
import { AbsentCodeModal } from "./absent-code-modal"

export type AbsentCode = {
  id: string
  code: string
  description: string
  isPaid: boolean
  fixedHours: number | null
  isDefault: boolean
  icon: string
  usageCount: number
}

const defaultCodes: AbsentCode[] = [
  {
    id: "1",
    code: "ANNUAL",
    description: "Annual Leave",
    isPaid: true,
    fixedHours: 8,
    isDefault: true,
    icon: "🌴",
    usageCount: 145,
  },
  {
    id: "2",
    code: "SICK",
    description: "Sick Leave",
    isPaid: true,
    fixedHours: 8,
    isDefault: true,
    icon: "🏥",
    usageCount: 89,
  },
  {
    id: "3",
    code: "FAMILY",
    description: "Family Responsibility Leave",
    isPaid: true,
    fixedHours: 8,
    isDefault: true,
    icon: "👨‍👩‍👧",
    usageCount: 34,
  },
  {
    id: "4",
    code: "UNPAID",
    description: "Unpaid Leave",
    isPaid: false,
    fixedHours: null,
    isDefault: false,
    icon: "📅",
    usageCount: 12,
  },
  {
    id: "5",
    code: "STUDY",
    description: "Study Leave",
    isPaid: true,
    fixedHours: 4,
    isDefault: false,
    icon: "📚",
    usageCount: 8,
  },
]

export function AbsentCodesScreen() {
  const [codes, setCodes] = useState<AbsentCode[]>(defaultCodes)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCode, setEditingCode] = useState<AbsentCode | null>(null)

  const handleAddCode = () => {
    setEditingCode(null)
    setIsModalOpen(true)
  }

  const handleEditCode = (code: AbsentCode) => {
    setEditingCode(code)
    setIsModalOpen(true)
  }

  const handleDeleteCode = (id: string) => {
    const code = codes.find((c) => c.id === id)
    if (code?.isDefault) {
      alert("Cannot delete default codes")
      return
    }
    if (confirm("Are you sure you want to delete this absence code?")) {
      setCodes(codes.filter((c) => c.id !== id))
    }
  }

  const handleSaveCode = (codeData: Omit<AbsentCode, "id" | "isDefault" | "usageCount">) => {
    if (editingCode) {
      setCodes(
        codes.map((c) =>
          c.id === editingCode.id
            ? { ...c, ...codeData }
            : c
        )
      )
    } else {
      const newCode: AbsentCode = {
        ...codeData,
        id: `${Date.now()}`,
        isDefault: false,
        usageCount: 0,
      }
      setCodes([...codes, newCode])
    }
    setIsModalOpen(false)
    setEditingCode(null)
  }

  const paidCodes = codes.filter((c) => c.isPaid)
  const unpaidCodes = codes.filter((c) => !c.isPaid)

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Absent Codes</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage leave and absence types for your organization
              </p>
            </div>
            <Button onClick={handleAddCode} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Absent Code
            </Button>
          </div>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <CalendarDays className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Codes</p>
                  <p className="text-2xl font-bold text-foreground">{codes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paid Types</p>
                  <p className="text-2xl font-bold text-foreground">{paidCodes.length}</p>
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
                  <p className="text-sm text-muted-foreground">Unpaid Types</p>
                  <p className="text-2xl font-bold text-foreground">{unpaidCodes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Usage</p>
                  <p className="text-2xl font-bold text-foreground">
                    {codes.reduce((sum, c) => sum + c.usageCount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Absent Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Icon</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Fixed Hours</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {codes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell>
                      <span className="text-2xl">{code.icon}</span>
                    </TableCell>
                    <TableCell className="font-mono font-medium">{code.code}</TableCell>
                    <TableCell>{code.description}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          code.isPaid
                            ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                            : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                        }
                      >
                        {code.isPaid ? "Paid" : "Unpaid"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {code.fixedHours !== null ? (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {code.fixedHours}h
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Variable</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">{code.usageCount} uses</span>
                    </TableCell>
                    <TableCell>
                      {code.isDefault ? (
                        <Badge variant="secondary">Default</Badge>
                      ) : (
                        <Badge variant="outline">Custom</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCode(code)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {!code.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCode(code.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      <AbsentCodeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingCode(null)
        }}
        onSave={handleSaveCode}
        editingCode={editingCode}
      />
    </div>
  )
}
