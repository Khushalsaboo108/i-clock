"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { createSiteAction } from "@/lib/actions"
import { siteFormSchema, type SiteFormValues } from "@/lib/validations/site.schema"

interface CreateSiteFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

/** Toggle fields configuration — single source of truth for all boolean switches */
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

export function CreateSiteForm({ onSuccess, onCancel }: CreateSiteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SiteFormValues>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: {
      name: "",
      site_code: "",
      contact: "",
      site_password: "",
      agrigistics_site: false,
      send_agrigistics_gps: false,
      pull_employees: false,
      send_attendance: false,
      easyroster: false,
      eduman: false,
      auto_remove_emp: false,
      access_user: false,
      easyroster_token: "",
      data_format: "<9,Pin><2,Day><2,Month><4,Year><2,Hour><2,Minute><2,Second><1,Status><-5,SN>",
      data_format_other: "<9,Pin><2,Day><2,Month><4,Year><2,Hour><2,Minute><2,Second><1,Status><-5,SN>",
      server_ip: "",
    },
  })

  async function onSubmit(data: SiteFormValues) {
    setIsSubmitting(true)
    try {
      const result = await createSiteAction(data)

      if (result.success) {
        toast.success("Company created", {
          description: `"${data.name}" has been created successfully.`,
        })
        form.reset()
        onSuccess?.()
      } else {
        toast.error("Failed to create company", {
          description: result.message || "Something went wrong.",
        })
        form.setError("root", {
          message: result.message || "Failed to create site",
        })
      }
    } catch {
      toast.error("Unexpected error", {
        description: "Please try again later.",
      })
      form.setError("root", {
        message: "An unexpected error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Root Error */}
        {form.formState.errors.root && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}

        {/* ── Basic Info ── */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Mentem" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="site_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Code *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. mentem-000-52" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 0099090" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="site_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Password *</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* ── Integration Toggles ── */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Integrations
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TOGGLE_FIELDS.map((toggle) => (
              <FormField
                key={toggle.name}
                control={form.control}
                name={toggle.name}
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">{toggle.label}</FormLabel>
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

          {/* Conditionally show EasyRoster Token */}
          {form.watch("easyroster") && (
            <FormField
              control={form.control}
              name="easyroster_token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EasyRoster Token</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter EasyRoster token" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* ── Advanced Config ── */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Advanced Configuration
          </h3>

          <FormField
            control={form.control}
            name="data_format"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Format</FormLabel>
                <FormControl>
                  <Input className="font-mono text-xs" {...field} />
                </FormControl>
                <FormDescription>Primary data format string</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="data_format_other"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Format (Other)</FormLabel>
                <FormControl>
                  <Input className="font-mono text-xs" {...field} />
                </FormControl>
                <FormDescription>Secondary data format string</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="server_ip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Server IP</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 1.1.1.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ── Actions ── */}
        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create Company
          </Button>
        </div>
      </form>
    </Form>
  )
}
