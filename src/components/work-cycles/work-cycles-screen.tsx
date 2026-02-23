'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { WorkRuleTable } from './work-rule-table';
import { WorkRuleForm } from './work-rule-form';
import {
  getWorkRules,
  createWorkRule,
  updateWorkRule,
  deleteWorkRule,
  getSingleWorkRule,
  type WorkRule,
} from '@/lib/actions/work-rules.actions';
import { useParams } from 'next/navigation';



interface WorkRuleInput {
  working_rule_name: string;
  shift_type: string;
  site_id: number;
  daily_hours: number;
  weekly_hours: number;
  start_time: string;
  end_time: string;
  break_minutes: number;
  late_threshold_minutes: number;
  early_leave_threshold_minutes: number;
  overtime_enabled: boolean;
  overtime_threshold_hours: number;
  status: string;
  is_default?: boolean;
}

export default function WorkRulesPage() {
  const params = useParams()

  const [workRules, setWorkRules] = useState<WorkRule[]>([]);
  console.log("working rules", workRules)
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<WorkRule | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const siteId: any = params.id

  // Fetch all work rules
  const fetchWorkRules = async () => {
    try {
      setIsLoading(true);
      const result = await getWorkRules(siteId, currentPage, 10);

      console.log("reustl", result)
      
      if (result.success) {
        setWorkRules(result.data || []);
      } else {
        toast.error(result.message || 'Failed to fetch work rules');
      }
    } catch (error) {
      console.error('Error fetching work rules:', error);
      toast.error('Failed to fetch work rules');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkRules();
  }, [siteId, currentPage]);

  const handleOpenDialog = (rule?: WorkRule) => {
    setSelectedRule(rule || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedRule(null);
  };

  const handleSubmit = async (formData: Partial<WorkRuleInput>) => {
    try {
      setIsSubmitting(true);

      if (selectedRule) {
        // Update existing rule
        const result = await updateWorkRule(
          selectedRule.working_rule_id,
          formData as Parameters<typeof updateWorkRule>[1]
        );

        if (result.success) {
          toast.success('Work rule updated successfully');
          handleCloseDialog();
          await fetchWorkRules();
        } else {
          toast.error(result.message || 'Failed to update work rule');
        }
      } else {
        // Create new rule
        const result = await createWorkRule({
          ...formData,
          site_id: siteId,
          is_default: formData.is_default || false,
        } as Parameters<typeof createWorkRule>[0]);

        if (result.success) {
          toast.success('Work rule created successfully');
          handleCloseDialog();
          await fetchWorkRules();
        } else {
          toast.error(result.message || 'Failed to create work rule');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this work rule?')) {
      return;
    }

    try {
      const result = await deleteWorkRule(id);

      if (result.success) {
        toast.success('Work rule deleted successfully');
        await fetchWorkRules();
      } else {
        toast.error(result.message || 'Failed to delete work rule');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete work rule');
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Work Rules</h1>
            <p className="mt-2 text-muted-foreground">
              Manage working hours, shifts, and overtime policies
            </p>
          </div>
          <Button
            onClick={() => handleOpenDialog()}
            size="lg"
            className="gap-2"
          >
            <Plus className="h-5 w-5" />
            New Work Rule
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workRules.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {workRules.filter((r) => r.status === 'Active').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Default Rule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">
                {workRules.find((r) => r.is_default)?.working_rule_name || 'None'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>All Work Rules</CardTitle>
            <CardDescription>
              View and manage all working rules for your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : workRules.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">
                  No work rules created yet
                </p>
                <Button onClick={() => handleOpenDialog()}>
                  Create First Work Rule
                </Button>
              </div>
            ) : (
              <WorkRuleTable
                workRules={workRules}
                onEdit={handleOpenDialog}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl h-3/5">
          <DialogHeader>
            <DialogTitle>
              {selectedRule ? 'Edit Work Rule' : 'Create New Work Rule'}
            </DialogTitle>
            <DialogDescription>
              {selectedRule
                ? 'Update the work rule details below'
                : 'Add a new work rule with shift timings and policies'}
            </DialogDescription>
          </DialogHeader>
          <WorkRuleForm
            initialData={selectedRule}
            onSubmit={handleSubmit}
            onCancel={handleCloseDialog}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
}
