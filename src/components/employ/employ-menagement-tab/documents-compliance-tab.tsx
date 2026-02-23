"use client"

import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, ShieldCheck, FileBadge, Bell } from "lucide-react"
import type { EmployeeFormValues } from "@/lib/validations/employee.schema"

export function DocumentsComplianceTab() {
  const { register, watch, setValue } = useFormContext<EmployeeFormValues>()

  return (
    <div className="space-y-8">
      {/* Section 1: Medical Information */}
      <section className="border border-border rounded-lg p-6 bg-card">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <h2 className="text-base font-semibold text-foreground">Medical Information</h2>
        </div>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="medical_check_date" className="text-sm font-medium text-muted-foreground mb-2 block">
                Last Check Date
              </Label>
              <Input id="medical_check_date" type="date" {...register("compliance_documents.medical.0.check_date")} className="h-10" />
            </div>
            <div>
              <Label htmlFor="medical_expiry_date" className="text-sm font-medium text-muted-foreground mb-2 block">
                Expiry Date
              </Label>
              <Input id="medical_expiry_date" type="date" {...register("compliance_documents.medical.0.expiry_date")} className="h-10" />
            </div>
          </div>
          <div>
            <Label htmlFor="medical_limitations" className="text-sm font-medium text-muted-foreground mb-2 block">
              Medical Limitations / Notes
            </Label>
            <Textarea
              id="medical_limitations"
              {...register("compliance_documents.medical.0.limitations")}
              placeholder="List any medical restrictions..."
              className="min-h-[80px]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="medical_notify"
              checked={watch("compliance_documents.medical.0.notify_user")}
              onCheckedChange={(v) => setValue("compliance_documents.medical.0.notify_user", v === true)}
            />
            <Label htmlFor="medical_notify" className="text-sm font-normal cursor-pointer flex items-center gap-2">
              <Bell className="w-3 h-3 text-muted-foreground" />
              Notify user before medical expiry
            </Label>
          </div>
        </div>
      </section>

      {/* Section 2: Driver's License */}
      <section className="border border-border rounded-lg p-6 bg-card">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
          <FileBadge className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-semibold text-foreground">Driver's License</h2>
        </div>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="license_code" className="text-sm font-medium text-muted-foreground mb-2 block">
                License Code / Number
              </Label>
              <Input id="license_code" {...register("compliance_documents.drivers_license.code")} className="h-10" placeholder="e.g. CODE 14" />
            </div>
            <div>
              <Label htmlFor="license_type" className="text-sm font-medium text-muted-foreground mb-2 block">
                License Type
              </Label>
              <Select value={watch("compliance_documents.drivers_license.type") ?? undefined} onValueChange={(v) => setValue("compliance_documents.drivers_license.type", v)}>
                <SelectTrigger id="license_type" className="h-10">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light Vehicle</SelectItem>
                  <SelectItem value="heavy">Heavy Vehicle</SelectItem>
                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  <SelectItem value="forklift">Forklift / Special</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="license_issued_date" className="text-sm font-medium text-muted-foreground mb-2 block">
                Issued Date
              </Label>
              <Input id="license_issued_date" type="date" {...register("compliance_documents.drivers_license.issued_date")} className="h-10" />
            </div>
            <div>
              <Label htmlFor="license_expiry_date" className="text-sm font-medium text-muted-foreground mb-2 block">
                Expiry Date
              </Label>
              <Input id="license_expiry_date" type="date" {...register("compliance_documents.drivers_license.expiry_date")} className="h-10" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="license_notify"
              checked={watch("compliance_documents.drivers_license.notify_user")}
              onCheckedChange={(v) => setValue("compliance_documents.drivers_license.notify_user", v === true)}
            />
            <Label htmlFor="license_notify" className="text-sm font-normal cursor-pointer flex items-center gap-2">
              <Bell className="w-3 h-3 text-muted-foreground" />
              Notify user before license expiry
            </Label>
          </div>
        </div>
      </section>

      {/* Section 3: Work Related Certificates */}
      <section className="border border-border rounded-lg p-6 bg-card">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
          <ShieldCheck className="w-5 h-5 text-amber-600" />
          <h2 className="text-base font-semibold text-foreground">Work Related Certificates</h2>
        </div>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="certificate_name" className="text-sm font-medium text-muted-foreground mb-2 block">
                Certificate Name
              </Label>
              <Input id="certificate_name" {...register("compliance_documents.certificates.0.name")} className="h-10" placeholder="e.g. Safety Training" />
            </div>
            <div>
              <Label htmlFor="certificate_number" className="text-sm font-medium text-muted-foreground mb-2 block">
                Certificate Number
              </Label>
              <Input id="certificate_number" {...register("compliance_documents.certificates.0.number")} className="h-10" placeholder="CERT-12345" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="certificate_issued_date" className="text-sm font-medium text-muted-foreground mb-2 block">
                Issued Date
              </Label>
              <Input id="certificate_issued_date" type="date" {...register("compliance_documents.certificates.0.issued_date")} className="h-10" />
            </div>
            <div>
              <Label htmlFor="certificate_reissue_date" className="text-sm font-medium text-muted-foreground mb-2 block">
                Re-Issue Date
              </Label>
              <Input id="certificate_reissue_date" type="date" {...register("compliance_documents.certificates.0.re_issue_date")} className="h-10" />
            </div>
          </div>
          <div>
            <Label htmlFor="certificate_description" className="text-sm font-medium text-muted-foreground mb-2 block">
              Description
            </Label>
            <Input id="certificate_description" {...register("compliance_documents.certificates.0.description")} className="h-10" placeholder="Brief details about the training..." />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="certificate_notify"
              checked={watch("compliance_documents.certificates.0.notify_user")}
              onCheckedChange={(v) => setValue("compliance_documents.certificates.0.notify_user", v === true)}
            />
            <Label htmlFor="certificate_notify" className="text-sm font-normal cursor-pointer flex items-center gap-2">
              <Bell className="w-3 h-3 text-muted-foreground" />
              Notify user before re-issue date
            </Label>
          </div>
        </div>
      </section>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Note:</strong> All documents uploaded here will be verified by the compliance officer.
          Notifications will be sent to the employee 30 days prior to expiry.
        </p>
      </div>
    </div>
  )
}
