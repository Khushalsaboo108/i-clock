"use client"

import { useFormContext } from "react-hook-form"
import { Switch } from "@/components/ui/switch"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { type SiteFormValues } from "@/lib/validations/site.schema"

const TOGGLE_FIELDS = [
  { name: "agrigistics_site" as const, label: "Agrigistics Site", description: "Enable Agrigistics integration" },
  { name: "send_agrigistics_gps" as const, label: "Send Agrigistics GPS", description: "Send GPS data to Agrigistics" },
  { name: "pull_employees" as const, label: "Pull Employees", description: "Auto-pull employee data" },
  { name: "send_attendance" as const, label: "Send Attendance", description: "Send attendance records" },
  { name: "easyroster" as const, label: "EasyRoster", description: "Enable EasyRoster integration" },
  { name: "eduman" as const, label: "Eduman", description: "Enable Eduman integration" },
  { name: "auto_remove_emp" as const, label: "Auto Remove Employees", description: "Automatically remove inactive employees" },
  { name: "access_user" as const, label: "Access User", description: "Allow user access" },
] as const

export function IntegrationsTab() {
  const { control, watch } = useFormContext<SiteFormValues>()
  const showEasyRosterToken = watch("easyroster")

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <section className="border border-border rounded-lg p-6 bg-card">
        <h2 className="text-base font-semibold text-foreground mb-5 pb-3 border-b border-border">
          External Integrations
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {TOGGLE_FIELDS.map((toggle) => (
            <FormField
              key={toggle.name}
              control={control}
              name={toggle.name}
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-xl border border-border p-4 bg-muted/20 hover:bg-muted/30 transition-colors">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-semibold">{toggle.label}</FormLabel>
                    <FormDescription className="text-xs">
                      {toggle.description}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div>

        {showEasyRosterToken && (
          <div className="mt-6 pt-6 border-t border-border animate-in slide-in-from-top-2 duration-200">
            <FormField
              control={control}
              name="easyroster_token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground mr-1">
                    EasyRoster Token <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your EasyRoster API token" className="h-10" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Required for establishing connection with EasyRoster services.
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        )}
      </section>
    </div>
  )
}
