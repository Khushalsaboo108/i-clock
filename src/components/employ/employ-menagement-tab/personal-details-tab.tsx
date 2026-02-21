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
              Street Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="address"
              {...register("personal_details.address.street")}
              className={`h-10 ${errors.personal_details?.address?.street ? "border-destructive" : ""}`}
              placeholder="123 Main St"
            />
            {errors.personal_details?.address?.street && <p className="text-xs text-destructive mt-1">{errors.personal_details.address.street.message}</p>}
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
                City / Town <span className="text-destructive">*</span>
              </Label>
              <Input
                id="town"
                {...register("personal_details.address.city")}
                className={`h-10 ${errors.personal_details?.address?.city ? "border-destructive" : ""}`}
                placeholder="e.g. Durban"
              />
              {errors.personal_details?.address?.city && <p className="text-xs text-destructive mt-1">{errors.personal_details.address.city.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="postal_code" className="text-sm font-medium text-muted-foreground mb-2 block">
                Postal Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="postal_code"
                {...register("personal_details.address.postal_code")}
                className={`h-10 ${errors.personal_details?.address?.postal_code ? "border-destructive" : ""}`}
                placeholder="400001"
              />
              {errors.personal_details?.address?.postal_code && <p className="text-xs text-destructive mt-1">{errors.personal_details.address.postal_code.message}</p>}
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-muted-foreground mb-2 block">
                Contact Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                {...register("personal_details.phone")}
                className={`h-10 ${errors.personal_details?.phone ? "border-destructive" : ""}`}
                placeholder="1234567890"
              />
              {errors.personal_details?.phone && <p className="text-xs text-destructive mt-1">{errors.personal_details.phone.message}</p>}
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
              <Label className="text-sm font-medium text-muted-foreground mb-3 block">
                Sex <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                value={watch("personal_details.gender")}
                onValueChange={(val) => setValue("personal_details.gender", val as any)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem {...register("personal_details.gender")} value="M" id="male" />
                  <Label htmlFor="male" className="font-normal cursor-pointer text-sm">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem {...register("personal_details.gender")} value="F" id="female" />
                  <Label htmlFor="female" className="font-normal cursor-pointer text-sm">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem {...register("personal_details.gender")} value="Other" id="other" />
                  <Label htmlFor="other" className="font-normal cursor-pointer text-sm">Other</Label>
                </div>
              </RadioGroup>
              {errors.personal_details?.gender && <p className="text-xs text-destructive mt-1">{errors.personal_details.gender.message}</p>}
            </div>
            <div>
              <Label htmlFor="marital_status" className="text-sm font-medium text-muted-foreground mb-2 block">
                Marriage Status <span className="text-destructive">*</span>
              </Label>
              <Select
                value={watch("personal_details.marital_status")}
                onValueChange={(val) => setValue("personal_details.marital_status", val)}
              >
                <SelectTrigger id="marital_status" className={`h-10 ${errors.personal_details?.marital_status ? "border-destructive" : ""}`}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
              {errors.personal_details?.marital_status && <p className="text-xs text-destructive mt-1">{errors.personal_details.marital_status.message}</p>}
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
                Contact Person <span className="text-destructive">*</span>
              </Label>
              <Input
                id="emergency_contact_person"
                {...register("personal_details.emergency_contact.person")}
                className={`h-10 ${errors.personal_details?.emergency_contact?.person ? "border-destructive" : ""}`}
                placeholder="Name & Surname"
              />
              {errors.personal_details?.emergency_contact?.person && <p className="text-xs text-destructive mt-1">{errors.personal_details.emergency_contact.person.message}</p>}
            </div>
            <div>
              <Label htmlFor="emergency_contact_relationship" className="text-sm font-medium text-muted-foreground mb-2 block">
                Relationship <span className="text-destructive">*</span>
              </Label>
              <Input
                id="emergency_contact_relationship"
                {...register("personal_details.emergency_contact.relationship")}
                className={`h-10 ${errors.personal_details?.emergency_contact?.relationship ? "border-destructive" : ""}`}
                placeholder="e.g. Spouse"
              />
              {errors.personal_details?.emergency_contact?.relationship && <p className="text-xs text-destructive mt-1">{errors.personal_details.emergency_contact.relationship.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="emergency_contact_number" className="text-sm font-medium text-muted-foreground mb-2 block">
              Contact Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="emergency_contact_number"
              {...register("personal_details.emergency_contact.number")}
              className={`h-10 ${errors.personal_details?.emergency_contact?.number ? "border-destructive" : ""}`}
              placeholder="+27 ..."
            />
            {errors.personal_details?.emergency_contact?.number && <p className="text-xs text-destructive mt-1">{errors.personal_details.emergency_contact.number.message}</p>}
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
                Bank Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="bank_name"
                {...register("personal_details.banking.bank_name")}
                className={`h-10 ${errors.personal_details?.banking?.bank_name ? "border-destructive" : ""}`}
                placeholder="Standard Bank, Chase, etc."
              />
              {errors.personal_details?.banking?.bank_name && <p className="text-xs text-destructive mt-1">{errors.personal_details.banking.bank_name.message}</p>}
            </div>
            <div>
              <Label htmlFor="account_type" className="text-sm font-medium text-muted-foreground mb-2 block">
                Account Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={watch("personal_details.banking.account_type")}
                onValueChange={(val) => setValue("personal_details.banking.account_type", val)}
              >
                <SelectTrigger id="account_type" className={`h-10 ${errors.personal_details?.banking?.account_type ? "border-destructive" : ""}`}>
                  <SelectValue placeholder="Current/Savings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking / Current</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
              {errors.personal_details?.banking?.account_type && <p className="text-xs text-destructive mt-1">{errors.personal_details.banking.account_type.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="account_number" className="text-sm font-medium text-muted-foreground mb-2 block">
                Account Number <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="account_number"
                  {...register("personal_details.banking.account_number")}
                  className={`h-10 pr-10 ${errors.personal_details?.banking?.account_number ? "border-destructive" : ""}`}
                  placeholder="Account #"
                />
              </div>
              {errors.personal_details?.banking?.account_number && <p className="text-xs text-destructive mt-1">{errors.personal_details.banking.account_number.message}</p>}
            </div>
            <div>
              <Label htmlFor="routing_number" className="text-sm font-medium text-muted-foreground mb-2 block">
                Routing / Branch Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="routing_number"
                {...register("personal_details.banking.routing_code")}
                className={`h-10 ${errors.personal_details?.banking?.routing_code ? "border-destructive" : ""}`}
                placeholder="000123"
              />
              {errors.personal_details?.banking?.routing_code && <p className="text-xs text-destructive mt-1">{errors.personal_details.banking.routing_code.message}</p>}
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
    </div >
  )
}
