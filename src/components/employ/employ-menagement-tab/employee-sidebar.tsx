import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Building2, MapPin } from "lucide-react"
import { useFormContext } from "react-hook-form"
import type { EmployeeFormValues } from "@/lib/validations/employee.schema"

export function EmployeeSidebar() {
  const { watch } = useFormContext<EmployeeFormValues>()
  const firstName = watch("first_name")
  const lastName = watch("last_name")
  const photoUrl = watch("personal_details.photo_url")
  const employeeId = watch("employee_id")
  const fullName = firstName || lastName ? `${firstName} ${lastName}`.trim() : ""

  return (
    <aside className="w-80 shrink-0">
      <div className="sticky top-8 space-y-6">
        {/* Employee Card Preview */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <div className="flex flex-col items-center">
            {/* Employee Photo */}
            <Avatar className="w-32 h-32 mb-6 border-2 border-border/50">
              <AvatarImage src={photoUrl || ""} alt="Employee Photo" />
              <AvatarFallback className="text-3xl bg-muted text-muted-foreground uppercase font-bold">
                {fullName ? fullName.substring(0, 1) + (lastName ? lastName.substring(0, 1) : "") : "User"}
              </AvatarFallback>
            </Avatar>

            {/* Employee Info */}
            <div className="text-center mb-6">
              <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-widest font-bold">
                Employee Profile
              </p>
              <h2 className="text-xl font-bold text-foreground mb-1">
                {fullName || "New Employee"}
              </h2>
              <div className="flex flex-col items-center gap-1.5 mt-2">
                <span className="text-[12px] font-medium text-muted-foreground bg-muted/50 px-2.5 py-0.5 rounded-full border border-border/50">
                  #{employeeId || "EMP-ID"}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full border-t border-border/50 my-6"></div>

            {/* Quick Info */}
            <div className="w-full space-y-4">
              <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                Employment Details
              </h3>

              <div className="space-y-3.5">
                <div className="flex items-center gap-3 text-[13px] text-foreground font-medium">
                  <div className="p-1.5 rounded bg-muted">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground leading-none mb-1">HIRED DATE</span>
                    <span>{watch("employment_date") || "---"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[13px] text-foreground font-medium">
                  <div className="p-1.5 rounded bg-muted">
                    <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground leading-none mb-1">ASSIGNED SITE</span>
                    <span>{watch("site_id") || "---"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[13px] text-foreground font-medium">
                  <div className="p-1.5 rounded bg-muted">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground leading-none mb-1">CURRENT PIN</span>
                    <span>{watch("pin") || "---"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="bg-muted/30 border border-border/50 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-semibold text-foreground">Status</span>
          </div>
          <span className="text-[10px] bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded border border-green-500/20">
            {watch("status") || "Active"}
          </span>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-1">
            Quick Actions
          </h3>
          <button
            type="button"
            onClick={() => {
              const id = watch("employee_id")
              window.location.href = `/clockings${id ? `?employeeId=${id}` : ""}`
            }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-primary/5 hover:bg-primary/10 text-primary rounded-xl border border-primary/20 transition-all group"
          >
            <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold">View T&A Clockings</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
