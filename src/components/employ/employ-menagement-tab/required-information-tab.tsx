"use client"

import { useFormContext, useFieldArray } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Lock, Plus, X, Info, FileText } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { EmployeeFormValues } from "@/lib/validations/employee.schema"

export function RequiredInformationTab({ isNew = false }: { isNew?: boolean }) {
  const { register, control, watch, setValue, formState: { errors } } = useFormContext<EmployeeFormValues>()

  const { fields: filters, append, remove } = useFieldArray({
    control,
    name: "filters"
  })

  const clockingSource = watch("clocking_config.source")
  const clockingMode = watch("clocking_config.mode")

  // effectiveMode: "directional" | "alternating"
  // If source === "work_rule" → use work rule default mode (assume directional for now)
  const effectiveMode = clockingSource === "work_rule" ? "directional" : clockingMode

  const addFilter = () => {
    append({ group: `Filter ${filters.length + 1}`, value: "" })
  }

  return (
    <div className="space-y-8">
      {/* Section 1: Company & Employee Identification */}
      <section className="border border-border rounded-lg p-6 bg-card">
        <h2 className="text-base font-semibold text-foreground mb-5 pb-3 border-b border-border">
          Company & Employee Identification
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="site_id" className="text-sm font-medium text-muted-foreground mb-2 block">
              Company ID <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="site_id"
                {...register("site_id")}
                className="h-10 pr-10"
                readOnly
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground italic mt-1 font-medium">Locked to current company</p>
          </div>
          <div>
            <Label htmlFor="employee_id" className="text-sm font-medium text-muted-foreground mb-2 block">
              Employee Number <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="employee_id"
                {...register("employee_id")}
                className={`h-10 pr-10 ${errors.employee_id ? "border-red-500" : ""}`}
                readOnly={!isNew}
                placeholder={isNew ? "Enter Employee ID" : ""}
              />
              {!isNew && <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />}
            </div>
            {errors.employee_id && <p className="text-xs text-red-500 mt-1">{errors.employee_id.message}</p>}
            {!isNew && <p className="text-xs text-muted-foreground italic mt-1">Must confirm to edit</p>}
          </div>
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-muted-foreground mb-2 block">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register("first_name")}
              className={`h-10 ${errors.first_name ? "border-red-500" : ""}`}
              placeholder="First Name"
            />
            {errors.first_name && <p className="text-xs text-red-500 mt-1">{errors.first_name.message}</p>}
            {!isNew && <p className="text-xs text-muted-foreground italic mt-1">Auto-filled</p>}
          </div>
          <div>
            <Label htmlFor="surname" className="text-sm font-medium text-muted-foreground mb-2 block">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="surname"
              {...register("last_name")}
              className={`h-10 ${errors.last_name ? "border-red-500" : ""}`}
              placeholder="Last Name"
            />
            {errors.last_name && <p className="text-xs text-red-500 mt-1">{errors.last_name.message}</p>}
            {!isNew && <p className="text-xs text-muted-foreground italic mt-1">Auto-filled</p>}
          </div>
          <div>
            <Label htmlFor="pin" className="text-sm font-medium text-muted-foreground mb-2 block">
              PIN <span className="text-red-500">*</span>
            </Label>
            <Input
              id="pin"
              {...register("pin")}
              className={`h-10 ${errors.pin ? "border-red-500" : ""}`}
              placeholder="System PIN"
            />
            {errors.pin && <p className="text-xs text-red-500 mt-1">{errors.pin.message}</p>}
          </div>
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-muted-foreground mb-2 block">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className={`h-10 ${errors.email ? "border-red-500" : ""}`}
              placeholder="email@example.com"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="card" className="text-sm font-medium text-muted-foreground mb-2 block">
              Card Number
            </Label>
            <Input
              id="card"
              {...register("card")}
              className="h-10"
              placeholder="Card ID (optional)"
            />
          </div>
        </div>
      </section>

      {/* Section: Access & Permissions */}
      <section className="border border-border rounded-lg p-6 bg-card">
        <h2 className="text-base font-semibold text-foreground mb-5 pb-3 border-b border-border">
          Access & Permissions
        </h2>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="username" className="text-sm font-medium text-muted-foreground mb-2 block">
                Username <span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                {...register("username")}
                className={`h-10 ${errors.username ? "border-red-500" : ""}`}
                placeholder="username"
                onKeyDown={(e) => {
                  // Block spaces and any character that doesn't match the allowed set [a-z0-9._-]
                  // Allow control keys (Backspace, Tab, Enter, Arrows)
                  const allowedKeys = /^[a-z0-9._-]$/
                  const isControlKey = ["Backspace", "Tab", "Enter", "ArrowLeft", "ArrowRight", "Delete"].includes(e.key)

                  if (!isControlKey && !allowedKeys.test(e.key)) {
                    e.preventDefault()
                  }
                }}
              />
              {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
              <p className="text-xs text-muted-foreground mt-1 font-medium italic">Lowercase letters, numbers, ., _, - only. No spaces.</p>
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-muted-foreground mb-2 block">
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className={`h-10 ${errors.password ? "border-red-500" : ""}`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
              <p className="text-xs text-muted-foreground mt-1 font-medium italic">Min 6 chars. Mix of letters, numbers & symbols recommended.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-2">
            <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-muted/20">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Permanent User</Label>
                <p className="text-[11px] text-muted-foreground">Permanent employee?</p>
              </div>
              <Switch
                checked={watch("permanent_user")}
                onCheckedChange={(val) => setValue("permanent_user", val)}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-muted/20">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Mobile Access</Label>
                <p className="text-[11px] text-muted-foreground">Allow mobile app?</p>
              </div>
              <Switch
                checked={watch("mobile")}
                onCheckedChange={(val) => setValue("mobile", val)}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-muted/20">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Privileged</Label>
                <p className="text-[11px] text-muted-foreground">Admin privileges?</p>
              </div>
              <Switch
                checked={watch("priv")}
                onCheckedChange={(val) => setValue("priv", val)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section: Categorization */}
      <section className="border border-border rounded-lg p-6 bg-card">
        <h2 className="text-base font-semibold text-foreground mb-5 pb-3 border-b border-border">
          Categorization
        </h2>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <Label htmlFor="category_id" className="text-sm font-medium text-muted-foreground mb-2 block">
              Category ID
            </Label>
            <Input
              id="category_id"
              type="number"
              {...register("category_id")}
              className="h-10"
            />
          </div>
          <div>
            <Label htmlFor="sub_category_id" className="text-sm font-medium text-muted-foreground mb-2 block">
              Sub Category ID
            </Label>
            <Input
              id="sub_category_id"
              type="number"
              {...register("sub_category_id")}
              className="h-10"
            />
          </div>
          <div>
            <Label htmlFor="work_center_id" className="text-sm font-medium text-muted-foreground mb-2 block">
              Work Center ID
            </Label>
            <Input
              id="work_center_id"
              type="number"
              {...register("work_center_id")}
              className="h-10"
            />
          </div>
        </div>
      </section>

      {/* Section 2: Employee Filters */}
      <section className="border border-border rounded-lg p-6 bg-card">
        <h2 className="text-base font-semibold text-foreground mb-5 pb-3 border-b border-border">Employee Filters</h2>
        <div className="space-y-4">
          {filters.map((field, index) => (
            <div key={field.id} className="flex items-center gap-4">
              <div className="flex-1">
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                  {field.group}
                  {index === 0 && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <Select
                  value={watch(`filters.${index}.value`)}
                  onValueChange={(val) => setValue(`filters.${index}.value`, val)}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder={`Select ${field.group}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-500/10 mt-7"
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="link" onClick={addFilter} className="text-blue-600 hover:text-blue-500 p-0 h-auto">
            <Plus className="w-4 h-4 mr-1" />
            Add Filter
          </Button>
        </div>
      </section>

      {/* Section 3: Work & Clocking Configuration */}
      <section className="border border-border rounded-lg p-6 bg-card">
        <h2 className="text-base font-semibold text-foreground mb-5 pb-3 border-b border-border">
          Work & Clocking Configuration
        </h2>

        <div className="space-y-6">
          {/* Part 1: Work Rules */}
          <div>
            <Label htmlFor="work_rules_id" className="text-sm font-medium text-muted-foreground mb-2 block">
              Work Rules <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-3">
              <Select
                value={String(watch("work_rules_id"))}
                onValueChange={(val) => setValue("work_rules_id", parseInt(val))}
              >
                <SelectTrigger id="work_rules_id" className="h-10 flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Standard 40hr Week</SelectItem>
                  <SelectItem value="2">Flexible Hours</SelectItem>
                  <SelectItem value="3">Shift Work</SelectItem>
                  <SelectItem value="4">Admin Special</SelectItem>
                </SelectContent>
              </Select>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="outline" size="sm" className="h-10 bg-blue-500/10 border-blue-500/20 text-blue-600 hover:bg-blue-500/20">
                      <FileText className="w-4 h-4 mr-2" />
                      Quick Guide
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Admin Staff: Shortcut to guide for rules and shifts used by this group.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Quick access to assigned rules and shifts</p>
          </div>

          <div className="border-t border-border/50 pt-6">
            <Label className="text-sm font-medium text-muted-foreground mb-3 block">Clocking Method</Label>
            <RadioGroup
              value={clockingSource}
              onValueChange={(v) => setValue("clocking_config.source", v as any)}
            >
              <div className="flex items-center space-x-2 mb-3">
                <RadioGroupItem value="work_rule" id="default-method" />
                <Label htmlFor="default-method" className="font-normal cursor-pointer">
                  Use Work Rule Default
                </Label>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="employee_override" id="override-method" />
                  <Label htmlFor="override-method" className="font-normal cursor-pointer">
                    Override:
                  </Label>
                </div>
                <div className="ml-6">
                  <Select
                    value={clockingMode}
                    onValueChange={(v) => setValue("clocking_config.mode", v as any)}
                    disabled={clockingSource === "work_rule"}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="directional">Directional</SelectItem>
                      <SelectItem value="alternating">Alternating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="border-t border-border/50 pt-6">
            <Label className="text-sm font-medium text-muted-foreground mb-3 block">
              {effectiveMode === "directional" ? "Directional Clocking" : "Alternating Detection"} <span className="text-red-500">*</span>
            </Label>

            <div className="space-y-4">
              {/* Directional Mode View */}
              {effectiveMode === "directional" && (
                <div className="bg-muted/30 rounded-lg p-4 border border-border">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Label className="font-semibold">
                          Clocking Saved as Received by Reader
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">If reader sends an IN, it MUST be recorded as an IN regardless of previous state.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-[13px] text-muted-foreground mt-1">Status (IN/OUT) is preserved from the hardware device.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Alternating Mode View */}
              {effectiveMode === "alternating" && (
                <div className="bg-muted/30 rounded-lg p-4 border border-border">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Label className="font-semibold">
                          Alternating Detection (Toggling)
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">First clock of day = IN. Automatically alternates OUT, IN, OUT...</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-[13px] text-muted-foreground mt-1 mb-4">
                        {"Force first clock as IN, then toggle status for each subsequent read."}
                      </p>

                      <div className="ml-0 mt-3 p-4 bg-card rounded border border-border shadow-sm">
                        <Label className="text-sm font-medium text-muted-foreground mb-3 block">
                          New Shift Consider Timing:
                        </Label>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              {...register("clocking_config.new_shift_threshold.hours")}
                              className="w-[70px] h-10 text-center"
                              min="0"
                            />
                            <span className="text-sm text-muted-foreground">hrs</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              {...register("clocking_config.new_shift_threshold.minutes")}
                              className="w-[70px] h-10 text-center"
                              min="0"
                              max="59"
                            />
                            <span className="text-sm text-muted-foreground">mins</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          Wait time after which the next clocking is seen as a new shift (Reset to IN).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Additional Required Information */}
      <section className="border border-border rounded-lg p-6 bg-card">
        <h2 className="text-base font-semibold text-foreground mb-5 pb-3 border-b border-border">
          Additional Required Information
        </h2>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <Label htmlFor="holiday_calendar_id" className="text-sm font-medium text-muted-foreground mb-2 block">
              Public Holiday Calendar <span className="text-red-500">*</span>
            </Label>
            <Select
              value={String(watch("public_holiday_calendar_id"))}
              onValueChange={(val) => setValue("public_holiday_calendar_id", parseInt(val))}
            >
              <SelectTrigger id="holiday_calendar_id" className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Standard Calendar</SelectItem>
                <SelectItem value="2">US Federal</SelectItem>
                <SelectItem value="3">UK Bank Holidays</SelectItem>
                <SelectItem value="4">South Africa Public</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="employment_date" className="text-sm font-medium text-muted-foreground mb-2 block">
              Employment Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="employment_date"
              type="date"
              {...register("employment_date")}
              className={`h-10 ${errors.employment_date ? "border-red-500" : ""}`}
            />
            {errors.employment_date && <p className="text-xs text-red-500 mt-1">{errors.employment_date.message}</p>}
          </div>
          <div>
            <Label htmlFor="reader_pin" className="text-sm font-medium text-muted-foreground mb-2 block">
              Reader PIN <span className="text-red-500">*</span>
            </Label>
            <Input
              id="reader_pin"
              type="password"
              {...register("reader_pin")}
              className="h-10"
              placeholder="Hardware PIN"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
