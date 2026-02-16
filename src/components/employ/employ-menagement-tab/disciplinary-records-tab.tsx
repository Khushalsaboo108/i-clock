"use client"

import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, History, Gavel, Calendar } from "lucide-react"
import type { EmployeeFormValues } from "@/lib/validations/employee.schema"

export function DisciplinaryRecordsTab() {
    const { register, watch, setValue } = useFormContext<EmployeeFormValues>()

    return (
        <div className="space-y-8">
            {/* Header Info */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                    <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-400">Initial Disciplinary Entry</h3>
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                        Use this section to record any existing disciplinary status for the new employee.
                        Detailed history can be added via the Management portal after creation.
                    </p>
                </div>
            </div>

            <section className="border border-border rounded-lg p-6 bg-card">
                <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
                    <Gavel className="w-5 h-5 text-red-600" />
                    <h2 className="text-base font-semibold text-foreground">Disciplinary offense tracking</h2>
                </div>

                <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="offense_type" className="text-sm font-medium text-muted-foreground mb-2 block">
                                Type of offense
                            </Label>
                            <Select
                                value={watch("disciplinary_records.0.offense_type")}
                                onValueChange={(v) => setValue("disciplinary_records.0.offense_type", v as any)}
                            >
                                <SelectTrigger id="offense_type" className="h-10">
                                    <SelectValue placeholder="Select offense level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None / Standard</SelectItem>
                                    <SelectItem value="verbal">Verbal Warning</SelectItem>
                                    <SelectItem value="written">First Written Warning</SelectItem>
                                    <SelectItem value="final">Final Written Warning</SelectItem>
                                    <SelectItem value="suspension">Suspension</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="offense_times_reported" className="text-sm font-medium text-muted-foreground mb-2 block">
                                No of times reported?
                            </Label>
                            <Input
                                id="offense_times_reported"
                                type="number"
                                {...register("disciplinary_records.0.times_reported", { valueAsNumber: true })}
                                className="h-10"
                                min="0"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="offense_notes" className="text-sm font-medium text-muted-foreground mb-2 block">
                            Note / Minutes
                        </Label>
                        <Textarea
                            id="offense_notes"
                            {...register("disciplinary_records.0.notes")}
                            placeholder="Record details of the incident and minutes of any hearings..."
                            className="min-h-[120px]"
                        />
                    </div>

                    <div className="max-w-md">
                        <Label htmlFor="offense_effective_until" className="text-sm font-medium text-muted-foreground mb-2 block">
                            Effective until and escalate?
                        </Label>
                        <div className="relative">
                            <Input
                                id="offense_effective_until"
                                type="date"
                                {...register("disciplinary_records.0.effective_until")}
                                className="h-10 pl-10"
                            />
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 italic">
                            Warning remains active on record until this date. Subsequent offenses may lead to automatic escalation.
                        </p>
                    </div>
                </div>
            </section>

            {/* Disciplinary History Placeholder */}
            <section className="border border-border rounded-lg p-6 bg-muted/20 opacity-80 pointer-events-none">
                <div className="flex items-center gap-2 mb-4">
                    <History className="w-5 h-5 text-muted-foreground" />
                    <h2 className="text-base font-semibold text-muted-foreground">Historical Records</h2>
                </div>
                <div className="text-center py-8 border-2 border-dashed border-border rounded-lg bg-background/50">
                    <p className="text-sm text-muted-foreground">Historical sequence will appear here after creation.</p>
                </div>
            </section>
        </div>
    )
}
