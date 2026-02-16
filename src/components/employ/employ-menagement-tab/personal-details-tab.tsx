"use client"

import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Lock, Eye, Upload, X, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import type { EmployeeFormValues } from "@/lib/validations/employee.schema"

export function PersonalDetailsTab({ isNew = false }: { isNew?: boolean }) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<EmployeeFormValues>()
  const photoPreview = watch("personal_details.photo_url")

  return (
    <div className="space-y-8">
      {/* Section 0: User Photo (Special Requirement) */}
      <section className="border border-border rounded-lg p-6 bg-card">
        <h2 className="text-base font-semibold text-foreground mb-5 pb-3 border-b border-border">
          User Photo <span className="text-xs font-normal text-muted-foreground ml-2">(Hardware Reader Generated)</span>
        </h2>
        <div className="flex items-start gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-lg border-2 border-dashed border-border overflow-hidden flex items-center justify-center bg-muted/30">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Upload className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-muted-foreground">
                Biometric Sync Only
              </Label>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex gap-4 mt-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Reader Generated Profile</p>
                  <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                    User photos are captured exclusively by the biometric hardware reader.
                    Manual upload or replacement is disabled to ensure data integrity with the reader hardware.
                  </p>
                </div>
              </div>
            </div>
            {watch("personal_details.photo_size_kb") ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded border border-border">
                  Hardware Generated Size: {watch("personal_details.photo_size_kb")} KB
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Section 1: Contact Information */}
      <section className="border border-border rounded-lg p-6 bg-card">
        <h2 className="text-base font-semibold text-foreground mb-5 pb-3 border-b border-border">
          Contact Information
        </h2>
        <div className="space-y-5">
          <div>
            <Label htmlFor="address" className="text-sm font-medium text-muted-foreground mb-2 block">
              Street Address
            </Label>
            <Input id="address" {...register("personal_details.address.street")} className="h-10" placeholder="123 Main St" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="suburb" className="text-sm font-medium text-muted-foreground mb-2 block">
                Suburb
              </Label>
              <Input id="suburb" {...register("personal_details.address.suburb")} className="h-10" placeholder="e.g. Waterfront" />
            </div>
            <div>
              <Label htmlFor="town" className="text-sm font-medium text-muted-foreground mb-2 block">
                City / Town
              </Label>
              <Input id="town" {...register("personal_details.address.city")} className="h-10" placeholder="e.g. Durban" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="postal_code" className="text-sm font-medium text-muted-foreground mb-2 block">
                Postal Code
              </Label>
              <Input id="postal_code" {...register("personal_details.address.postal_code")} className="h-10" placeholder="4001" />
            </div>
            <div>
              <Label htmlFor="contact_number" className="text-sm font-medium text-muted-foreground mb-2 block">
                Contact Number
              </Label>
              <Input id="contact_number" {...register("personal_details.contact_number")} className="h-10" placeholder="+27 12 345 6789" />
            </div>
          </div>
          <div>
            <Label htmlFor="id_no" className="text-sm font-medium text-muted-foreground mb-2 block">
              ID Number
            </Label>
            <Input id="id_no" {...register("personal_details.id_number")} className="h-10" placeholder="Identity Number" />
          </div>
        </div>
      </section>

      {/* Section 2: Personal Information */}
      <section className="border border-border rounded-lg p-6 bg-card">
        <h2 className="text-base font-semibold text-foreground mb-5 pb-3 border-b border-border">
          Personal Information
        </h2>
        <div className="space-y-5">
          <div>
            <Label htmlFor="birth_date" className="text-sm font-medium text-muted-foreground mb-2 block">
              Date of Birth
            </Label>
            <div className="flex items-center gap-4">
              <Input id="birth_date" type="date" {...register("personal_details.dob")} className="h-10 flex-1" />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="birthday-notifications"
                  checked={watch("personal_details.birthday_notifications")}
                  onCheckedChange={(val) => setValue("personal_details.birthday_notifications", val === true)}
                />
                <Label htmlFor="birthday-notifications" className="font-normal cursor-pointer text-sm">
                  Notify user?
                </Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium text-muted-foreground mb-3 block">Sex</Label>
              <RadioGroup
                value={watch("personal_details.sex")}
                onValueChange={(val) => setValue("personal_details.sex", val as any)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="M" id="male" />
                  <Label htmlFor="male" className="font-normal cursor-pointer text-sm">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="F" id="female" />
                  <Label htmlFor="female" className="font-normal cursor-pointer text-sm">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-specified" id="not-specified" />
                  <Label htmlFor="not-specified" className="font-normal cursor-pointer text-sm">Not Specified</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="marital_status" className="text-sm font-medium text-muted-foreground mb-2 block">
                Marriage Status
              </Label>
              <Select
                value={watch("personal_details.marital_status")}
                onValueChange={(val) => setValue("personal_details.marital_status", val)}
              >
                <SelectTrigger id="marital_status" className="h-10">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Emergency Contact */}
      <section className="border border-border rounded-lg p-6 bg-card">
        <h2 className="text-base font-semibold text-foreground mb-5 pb-3 border-b border-border">Emergency Contact</h2>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="emergency_contact_person" className="text-sm font-medium text-muted-foreground mb-2 block">
                Contact Person
              </Label>
              <Input id="emergency_contact_person" {...register("personal_details.emergency_contact.person")} className="h-10" placeholder="Name & Surname" />
            </div>
            <div>
              <Label htmlFor="emergency_contact_relationship" className="text-sm font-medium text-muted-foreground mb-2 block">
                Relationship
              </Label>
              <Input id="emergency_contact_relationship" {...register("personal_details.emergency_contact.relationship")} className="h-10" placeholder="e.g. Spouse" />
            </div>
          </div>
          <div>
            <Label htmlFor="emergency_contact_number" className="text-sm font-medium text-muted-foreground mb-2 block">
              Contact Number
            </Label>
            <Input id="emergency_contact_number" {...register("personal_details.emergency_contact.number")} className="h-10" placeholder="+27 ..." />
          </div>
        </div>
      </section>

      {/* Section 4: Banking Information */}
      <section className="border border-border rounded-lg p-6 bg-card">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Banking Information</h2>
          <Lock className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="bank_name" className="text-sm font-medium text-muted-foreground mb-2 block">
                Bank Name
              </Label>
              <Input id="bank_name" {...register("personal_details.banking.bank_name")} className="h-10" placeholder="Standard Bank, Chase, etc." />
            </div>
            <div>
              <Label htmlFor="account_type" className="text-sm font-medium text-muted-foreground mb-2 block">
                Account Type
              </Label>
              <Select
                value={watch("personal_details.banking.account_type")}
                onValueChange={(val) => setValue("personal_details.banking.account_type", val)}
              >
                <SelectTrigger id="account_type" className="h-10">
                  <SelectValue placeholder="Current/Savings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking / Current</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="account_number" className="text-sm font-medium text-muted-foreground mb-2 block">
                Account Number
              </Label>
              <div className="relative">
                <Input id="account_number" {...register("personal_details.banking.account_number")} className="h-10 pr-10" placeholder="Account #" />
              </div>
            </div>
            <div>
              <Label htmlFor="routing_number" className="text-sm font-medium text-muted-foreground mb-2 block">
                Routing / Branch Code
              </Label>
              <Input id="routing_number" {...register("personal_details.banking.routing_code")} className="h-10" placeholder="000123" />
            </div>
          </div>
        </div>
      </section>

      {/* Section: Vehicle & Property */}
      <section className="border border-border rounded-lg p-6 bg-card">
        <h2 className="text-base font-semibold text-foreground mb-5 pb-3 border-b border-border">
          Vehicle & Property
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="vehicle_reg_no" className="text-sm font-medium text-muted-foreground mb-2 block">
              Vehicle Registration Number
            </Label>
            <Input
              id="vehicle_reg_no"
              {...register("vehicle_reg_no")}
              className="h-10"
              placeholder="e.g. ABC 123 GP"
            />
          </div>
          <div>
            <Label htmlFor="property_number" className="text-sm font-medium text-muted-foreground mb-2 block">
              Property Number / Unit
            </Label>
            <Input
              id="property_number"
              {...register("property_number")}
              className="h-10"
              placeholder="e.g. Unit 4B"
            />
          </div>
        </div>
      </section>

      {/* Section 5: Notes */}
      <section className="border border-border rounded-lg p-6 bg-card">
        <h2 className="text-base font-semibold text-foreground mb-5 pb-3 border-b border-border">Notes</h2>
        <div>
          <Textarea
            {...register("personal_details.notes")}
            placeholder="Open text box for any note that you wish to add..."
            className="min-h-[120px] resize-none"
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">Character count: {watch("personal_details.notes")?.length || 0} / 5000</p>
          </div>
        </div>
      </section>
    </div >
  )
}
