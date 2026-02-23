'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';

interface WorkRule {
  working_rule_id: number;
  site_id: number;
  working_rule_name: string;
  shift_type: string;
  daily_hours: number;
  weekly_hours: number;
  start_time: string;
  end_time: string;
  break_minutes: number;
  late_threshold_minutes: number;
  early_leave_threshold_minutes: number;
  overtime_enabled: boolean;
  overtime_threshold_hours: number;
  is_default: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

interface WorkRuleTableProps {
  workRules: WorkRule[];
  onEdit: (rule: WorkRule) => void;
  onDelete: (id: number) => void;
}

export function WorkRuleTable({
  workRules,
  onEdit,
  onDelete,
}: WorkRuleTableProps) {
  const getStatusBadge = (status: string) => {
    return status === 'Active' ? (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        Active
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
        Inactive
      </Badge>
    );
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Rule Name</TableHead>
            <TableHead className="font-semibold">Shift Type</TableHead>
            <TableHead className="text-center font-semibold">Hours</TableHead>
            <TableHead className="text-center font-semibold">Timing</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workRules.map((rule) => (
            <TableRow key={rule.working_rule_id} className="hover:bg-muted/50">
              <TableCell>
                <div>
                  <p className="font-medium">{rule.working_rule_name}</p>
                  {rule.is_default && (
                    <Badge variant="secondary" className="mt-1">
                      Default
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {rule.shift_type}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <div className="text-sm">
                  <p className="font-medium">{rule.daily_hours}h/day</p>
                  <p className="text-xs text-muted-foreground">
                    {rule.weekly_hours}h/week
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="text-sm">
                  <p className="font-medium">
                    {formatTime(rule.start_time)} - {formatTime(rule.end_time)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Break: {rule.break_minutes}m
                  </p>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(rule.status)}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(rule)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(rule.working_rule_id)}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
