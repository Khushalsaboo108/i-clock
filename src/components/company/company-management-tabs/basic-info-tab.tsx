"use client"

import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { type SiteFormValues } from "@/lib/validations/site.schema"
import { Info } from "lucide-react"

export function BasicInfoTab() {
  const { control } = useFormContext<SiteFormValues>()

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <section className="border border-border rounded-lg p-6 bg-card">
        <h2 className="text-base font-semibold text-foreground mb-5 pb-3 border-b border-border">
          General Information
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-muted-foreground mr-1">
                  Company Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Mentem Corp" className="h-10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="site_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-muted-foreground mr-1">
                  Site Code <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g. MTM-01" className="h-10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-muted-foreground">
                  Contact Number
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g. +1 555-0123" className="h-10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="site_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-muted-foreground mr-1">
                  Site Password <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" className="h-10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>

      <div className="bg-muted/30 border border-border rounded-lg p-4 flex gap-4">
        <div className="p-2 bg-background rounded-full h-fit border border-border">
          <Info className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Important</h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            The Site Code is required for device synchronization and cannot be duplicates within the system.
            Ensure the password is secure as it will be used for API authentication from terminal devices.
          </p>
        </div>
      </div>
    </div>
  )
}
