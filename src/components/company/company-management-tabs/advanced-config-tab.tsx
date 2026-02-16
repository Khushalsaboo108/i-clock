"use client"

import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage
} from "@/components/ui/form"
import { type SiteFormValues } from "@/lib/validations/site.schema"
import { Shield, Network } from "lucide-react"

export function AdvancedConfigTab() {
  const { control } = useFormContext<SiteFormValues>()

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <section className="border border-border rounded-lg p-6 bg-card">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-base font-semibold text-foreground">
            Advanced Configuration
          </h2>
        </div>

        <div className="space-y-6">
          <FormField
            control={control}
            name="data_format"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-muted-foreground">
                  Primary Data Format
                </FormLabel>
                <FormControl>
                  <Input className="font-mono text-sm h-10 bg-muted/50" {...field} />
                </FormControl>
                <FormDescription className="text-xs">
                  Defines the structure for incoming attendance logs.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="data_format_other"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-muted-foreground">
                  Secondary Data Format (Backup)
                </FormLabel>
                <FormControl>
                  <Input className="font-mono text-sm h-10 bg-muted/50" {...field} />
                </FormControl>
                <FormDescription className="text-xs">
                  Alternative structure used if primary format fails validation.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>

      <section className="border border-border rounded-lg p-6 bg-card">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
          <Network className="w-5 h-5 text-primary" />
          <h2 className="text-base font-semibold text-foreground">
            Networking Details
          </h2>
        </div>

        <FormField
          control={control}
          name="server_ip"
          render={({ field }) => (
            <FormItem className="max-w-md">
              <FormLabel className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Dedicated Server IP
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g. 192.168.1.100" className="h-10" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Static IP address for the site-specific biometric server.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </section>
    </div>
  )
}
