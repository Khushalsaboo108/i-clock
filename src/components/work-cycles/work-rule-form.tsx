"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";

const workRuleSchema = z.object({
  working_rule_name: z.string().min(1, "Rule name is required"),
  shift_type: z.string().min(1, "Shift type is required"),
  site_id: z.number().int().positive(),
  daily_hours: z.number().positive().max(24),
  weekly_hours: z.number().positive().max(168),
  start_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, "Invalid time format"),
  end_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, "Invalid time format"),
  break_minutes: z.number().int().min(0),
  late_threshold_minutes: z.number().int().min(0),
  early_leave_threshold_minutes: z.number().int().min(0),
  overtime_enabled: z.boolean(),
  overtime_threshold_hours: z.number().min(0),
  status: z.enum(["Active", "Inactive"]),
});

type WorkRuleFormData = z.infer<typeof workRuleSchema>;

interface WorkRuleFormProps {
  initialData?: any;
  onSubmit: (data: Partial<WorkRuleFormData>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function WorkRuleForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: WorkRuleFormProps) {
  const form = useForm<WorkRuleFormData>({
    resolver: zodResolver(workRuleSchema),
    defaultValues: {
      working_rule_name: initialData?.working_rule_name || "",
      shift_type: initialData?.shift_type || "",
      site_id: initialData?.site_id || 1,
      daily_hours: initialData?.daily_hours || 8,
      weekly_hours: initialData?.weekly_hours || 40,
      start_time: initialData?.start_time || "09:00:00",
      end_time: initialData?.end_time || "17:00:00",
      break_minutes: initialData?.break_minutes || 30,
      late_threshold_minutes: initialData?.late_threshold_minutes || 15,
      early_leave_threshold_minutes:
        initialData?.early_leave_threshold_minutes || 15,
      overtime_enabled: initialData?.overtime_enabled || false,
      overtime_threshold_hours: initialData?.overtime_threshold_hours || 24,
      status: initialData?.status || "Active",
    },
  });

  const overtimeEnabled = form.watch("overtime_enabled");

  return (
    <div className="overflow-y-auto pb-20 scrollbar-hide">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="working_rule_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rule Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 40 Hours per week" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shift_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shift Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Day Shift">Day Shift</SelectItem>
                        <SelectItem value="Night Shift">Night Shift</SelectItem>
                        <SelectItem value="Evening Shift">
                          Evening Shift
                        </SelectItem>
                        <SelectItem value="Rotating Shift">
                          Rotating Shift
                        </SelectItem>
                        <SelectItem value="Flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="site_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site ID</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Working Hours</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="daily_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Hours</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.5"
                        min="0"
                        max="24"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>Hours per day</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weekly_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weekly Hours</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.5"
                        min="0"
                        max="168"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>Hours per week</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="break_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Break Duration</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="30"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>Minutes</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Shift Timings */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shift Timings</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        step="60"
                        {...field}
                        onChange={(e) => {
                          const time = e.target.value;
                          field.onChange(`${time}:00`);
                        }}
                        value={field.value?.substring(0, 5) || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        step="60"
                        {...field}
                        onChange={(e) => {
                          const time = e.target.value;
                          field.onChange(`${time}:00`);
                        }}
                        value={field.value?.substring(0, 5) || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Threshold Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Threshold Settings</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="late_threshold_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Late Threshold</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="30"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Minutes before marked as late
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="early_leave_threshold_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Early Leave Threshold</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="30"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Minutes before marked as early leave
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Overtime Settings */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="overtime_enabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div>
                        <FormLabel>Enable Overtime</FormLabel>
                        <FormDescription>
                          Allow overtime hours beyond threshold
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

                {overtimeEnabled && (
                  <FormField
                    control={form.control}
                    name="overtime_threshold_hours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overtime Threshold</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.5"
                            min="0"
                            placeholder="24"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Weekly hours limit before overtime is calculated
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t scrollbar-hide from-white via-white to-white/95 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950/95 px-6 py-4 border-t border-border dark:border-slate-800 shadow-lg backdrop-blur-sm">
            <div className="flex justify-end gap-3 max-w-7xl mx-auto">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : initialData
                    ? "Update Rule"
                    : "Create Rule"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
