import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Building2, MapPin } from "lucide-react"

export function EmployeeSidebar() {
  return (
    <aside className="w-[280px] bg-background border-r border-border p-6 flex flex-col justify-between h-full">
      <div className="flex flex-col items-center">
        {/* Employee Photo */}
        <Avatar className="w-[150px] h-[150px] mb-4">
          <AvatarImage src="/professional-headshot.png" alt="John Smith" />
          <AvatarFallback className="text-3xl">JS</AvatarFallback>
        </Avatar>

        {/* Employee Info */}
        <div className="text-center mb-4">
          <p className="text-xs text-muted-foreground mb-1">Employee #12345</p>
          <h2 className="text-base font-bold text-foreground mb-1">John Michael Smith</h2>
          <p className="text-sm text-muted-foreground">Software Engineer</p>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-border my-4"></div>

        {/* Quick Info */}
        <div className="w-full">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Quick Info</h3>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-[13px] text-foreground">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>Hired: Jan 15, 2020</span>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-foreground">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>Tenure: 4.8 years</span>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-foreground">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span>Company: TechCorp</span>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-foreground">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>Location: New York</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
