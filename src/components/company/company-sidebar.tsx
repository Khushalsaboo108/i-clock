"use client"

import { useFormContext } from "react-hook-form"
import { Building2, Hash, Contact, ShieldCheck } from "lucide-react"
import { type SiteFormValues } from "@/lib/validations/site.schema"

export function CompanySidebar() {
  const { watch } = useFormContext<SiteFormValues>()
  const name = watch("name")
  const siteCode = watch("site_code")
  const contact = watch("contact")

  return (
    <aside className="w-80 shrink-0">
      <div className="sticky top-8 space-y-6">
        {/* Company Card Preview */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <div className="flex flex-col items-center">
            {/* Visual Icon/Avatar */}
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-primary" />
            </div>

            <div className="text-center mb-6">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">
                New Company
              </p>
              <h2 className="text-xl font-bold text-foreground break-all px-2">
                {name || "Company Name"}
              </h2>
              <div className="flex flex-col items-center gap-1.5 mt-2">
                <span className="text-[12px] font-medium text-muted-foreground bg-muted/50 px-2.5 py-0.5 rounded-full border border-border/50">
                  {siteCode || "SITE-CODE-ID"}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full border-t border-border/50 my-6"></div>

            {/* Live Details */}
            <div className="w-full space-y-4">
              <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                Live Details
              </h3>

              <div className="space-y-3.5">
                <div className="flex items-center gap-3 text-[13px] text-foreground font-medium">
                  <div className="p-1.5 rounded bg-muted">
                    <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground leading-none mb-1">STATION CODE</span>
                    <span>{siteCode || "---"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[13px] text-foreground font-medium">
                  <div className="p-1.5 rounded bg-muted">
                    <Contact className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground leading-none mb-1">CONTACT INFO</span>
                    <span>{contact || "---"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[13px] text-foreground font-medium">
                  <div className="p-1.5 rounded bg-muted">
                    <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground leading-none mb-1">STATUS</span>
                    <span className="text-green-600 dark:text-green-400">Ready to Create</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-5">
          <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Setup Guide</h4>
          <p className="text-[12px] text-blue-800/80 dark:text-blue-300/80 leading-relaxed italic">
            "Complete the basic information first to activate integration settings and advanced configurations."
          </p>
        </div>
      </div>
    </aside>
  )
}
