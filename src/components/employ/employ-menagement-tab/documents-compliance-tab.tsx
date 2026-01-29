"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, AlertTriangle, CheckCircle2, XCircle, Upload } from "lucide-react"

type Document = {
  id: string
  type: "medical" | "license" | "training"
  title: string
  checkDate: string
  expiryDate: string
  status: "valid" | "warning" | "expired"
  notify: boolean
  file?: string
}

export function DocumentsComplianceTab() {
  const [documents] = useState<Document[]>([
    {
      id: "1",
      type: "medical",
      title: "Medical Record #1",
      checkDate: "01/15/2024",
      expiryDate: "01/15/2026",
      status: "warning",
      notify: true,
    },
    {
      id: "2",
      type: "medical",
      title: "Medical Record #2",
      checkDate: "06/20/2023",
      expiryDate: "06/20/2025",
      status: "valid",
      notify: true,
    },
    {
      id: "3",
      type: "license",
      title: "Driver's License",
      checkDate: "03/10/2023",
      expiryDate: "03/10/2028",
      status: "valid",
      notify: true,
      file: "drivers-license.pdf",
    },
    {
      id: "4",
      type: "license",
      title: "Professional Certification",
      checkDate: "09/01/2021",
      expiryDate: "09/01/2023",
      status: "expired",
      notify: false,
      file: "certification.pdf",
    },
    {
      id: "5",
      type: "training",
      title: "Safety Training",
      checkDate: "11/15/2024",
      expiryDate: "11/15/2025",
      status: "valid",
      notify: true,
      file: "safety-training-cert.pdf",
    },
  ])

  switch (status) {
    case "valid":
      return <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500" />
    case "warning":
      return <AlertTriangle className="w-4 h-4 text-amber-500" />
    case "expired":
      return <XCircle className="w-4 h-4 text-red-600 dark:text-red-500" />
  }

  const getStatusBadge = (status: Document["status"]) => {
    switch (status) {
      case "valid":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Valid
          </Badge>
        )
      case "warning":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Expires in 2 months
          </Badge>
        )
      case "expired":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300">
            <XCircle className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        )
    }
  }

  const medicalDocs = documents.filter((d) => d.type === "medical")
  const licenseDocs = documents.filter((d) => d.type === "license")
  const trainingDocs = documents.filter((d) => d.type === "training")

  const DocumentCard = ({ doc }: { doc: Document }) => (
    <Card className="p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium text-foreground">{doc.title}</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10 dark:text-red-400">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="border-t border-border pt-3 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Check Date:</span>
          <span className="text-foreground">{doc.checkDate}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Expiry Date:</span>
          <div className="flex items-center gap-2">
            <span className="text-foreground">{doc.expiryDate}</span>
            {getStatusBadge(doc.status)}
          </div>
        </div>
        {doc.file && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Attachment:</span>
            <Button variant="link" className="h-auto p-0 text-blue-600 text-sm">
              {doc.file}
            </Button>
          </div>
        )}
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox id={`notify-${doc.id}`} defaultChecked={doc.notify} />
          <Label htmlFor={`notify-${doc.id}`} className="text-sm font-normal cursor-pointer">
            Notify user before expiry
          </Label>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="space-y-8">
      {/* Section 1: Medical Information */}
      <section className="border border-border rounded-lg p-6 bg-card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-foreground">Medical Information</h2>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Medical
          </Button>
        </div>
        <div className="space-y-4">
          {medicalDocs.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      </section>

      {/* Section 2: Licenses */}
      <section className="border border-border rounded-lg p-6 bg-card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-foreground">Licenses</h2>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add License
          </Button>
        </div>
        <div className="space-y-4">
          {licenseDocs.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      </section>

      {/* Section 3: Training Certificates */}
      <section className="border border-border rounded-lg p-6 bg-card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-foreground">Training Certificates</h2>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Training
          </Button>
        </div>
        <div className="space-y-4">
          {trainingDocs.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      </section>

      {/* Bulk Upload Section */}
      <section className="border border-border rounded-lg p-6 bg-card">
        <h2 className="text-base font-semibold text-foreground mb-5">Bulk Document Upload</h2>
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer">
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">Click to upload or drag and drop</p>
          <p className="text-xs text-muted-foreground">PDF, PNG, JPG up to 10MB each</p>
        </div>
      </section>
    </div>
  )
}
