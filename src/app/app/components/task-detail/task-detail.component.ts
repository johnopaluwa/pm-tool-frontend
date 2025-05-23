import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // Import Router
import { forkJoin, Observable, of, Subscription } from 'rxjs'; // Import Observable, of
import { switchMap } from 'rxjs/operators'; // Import switchMap

import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

import {
  CustomFieldDefinition,
  CustomFieldValue,
  CustomizationService,
} from '../../../services/customization.service';
import { DialogService } from '../../../services/dialog.service'; // Import DialogService
import { Project, ProjectService } from '../../../services/project.service'; // Import ProjectService and Project interface
import { Task, TaskService } from '../../../services/task.service'; // Import TaskService and Task interface
import {
  StageStatus,
  Workflow,
  WorkflowService,
  WorkflowStage,
} from '../../../services/workflow.service'; // Import WorkflowService and workflow interfaces

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // Add FormsModule
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css',
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  task: Task | undefined; // To store task data
  project: Project | undefined; // To store associated project data
  workflow: Workflow | undefined; // To store associated workflow data
  stages: WorkflowStage[] = []; // To store workflow stages
  statuses: StageStatus[] = []; // To store all statuses for the workflow
  validNextStatuses: StageStatus[] = []; // To store valid statuses for transition

  customFieldDefinitions: CustomFieldDefinition[] = []; // To store custom field definitions for tasks
  customFieldValues: CustomFieldValue[] = []; // To store custom field values for this task

  selectedStatusId: string | null = null; // To hold the selected status ID for updating

  private taskSubscription: Subscription | undefined; // Subscription for task data
  private projectSubscription: Subscription | undefined; // Subscription for project data
  private workflowDataSubscription: Subscription | undefined; // Subscription for workflow data
  private customFieldsSubscription: Subscription | undefined; // Subscription for custom fields
  private updateTaskSubscription: Subscription | undefined; // Subscription for updating task
  private deleteTaskSubscription: Subscription | undefined; // Subscription for deleting task

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Inject Router
    private taskService: TaskService, // Inject TaskService
    private projectService: ProjectService, // Inject ProjectService
    private workflowService: WorkflowService, // Inject WorkflowService
    private customizationService: CustomizationService, // Inject CustomizationService
    private dialogService: DialogService // Inject DialogService
  ) {}

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      // Fetch task data
      this.taskSubscription = this.taskService.findOne(taskId).subscribe({
        next: (task: Task | undefined) => {
          this.task = task;
          if (task) {
            this.selectedStatusId = task.status_id || null; // Set selected status

            // Fetch associated project and workflow data in parallel
            this.loadProjectAndWorkflowData(task.project_id);
            // Load custom fields for the task
            this.loadCustomFields(taskId);
          } else {
            // Task not found, navigate back or show error
            this.router.navigate(['/projects']); // Assuming tasks are viewed within a project context
          }
        },
        error: (error: any) => {
          console.error('Error loading task data:', error);
          // TODO: Display user-friendly error message
        },
      });
    }
  }

  loadProjectAndWorkflowData(projectId: string): void {
    this.projectSubscription = this.projectService
      .getProjectById(projectId)
      .pipe(
        switchMap(
          (
            project
          ): Observable<[Workflow, WorkflowStage[]] | [undefined, []]> => {
            // Explicitly type the switchMap return
            this.project = project;
            if (project?.workflow_id) {
              // Fetch workflow stages and statuses if workflow is assigned
              return forkJoin([
                this.workflowService.getWorkflow(project.workflow_id),
                this.workflowService.getWorkflowStages(project.workflow_id),
              ]);
            } else {
              // No workflow assigned, return empty observables
              return of([undefined, []]);
            }
          }
        )
      )
      .subscribe({
        next: ([workflow, stages]: [
          Workflow | undefined,
          WorkflowStage[] | []
        ]) => {
          // Explicitly type the array elements to handle both cases
          this.workflow = workflow;
          this.stages = stages || [];
          // Fetch statuses for all stages in the workflow
          if (this.stages.length > 0) {
            const statusObservables = this.stages.map(
              (stage) =>
                this.workflowService.getStageStatuses(
                  this.workflow!.id!,
                  stage.id!
                ) // Use workflowId and stageId
            );
            forkJoin(statusObservables).subscribe({
              next: (statusesArrays: StageStatus[][]) => {
                this.statuses = statusesArrays.flat(); // Flatten the array of arrays
                this.determineValidNextStatuses(); // Determine valid transitions
              },
              error: (error: any) => {
                console.error('Error loading stage statuses:', error);
                // TODO: Handle error
              },
            });
          } else {
            this.statuses = [];
            this.determineValidNextStatuses(); // Determine valid transitions (likely none)
          }
        },
        error: (error: any) => {
          console.error('Error loading project or workflow data:', error);
          // TODO: Display user-friendly error message
        },
      });
  }

  loadCustomFields(taskId: string): void {
    // TODO: Determine how to get the organizationId in the frontend.
    // For now, assuming backend handles organization scoping for field definitions.
    // Fetch both definitions and values in parallel
    this.customFieldsSubscription = forkJoin([
      this.customizationService.getFieldDefinitions('task'), // Fetch definitions for 'task' entity type
      this.customizationService.getFieldValuesForEntity('task', taskId), // Fetch values for this specific task
    ]).subscribe({
      next: ([definitions, values]) => {
        this.customFieldDefinitions = definitions;
        this.customFieldValues = values;
        console.log('Custom field definitions:', this.customFieldDefinitions);
        console.log('Custom field values:', this.customFieldValues);
      },
      error: (error: any) => {
        console.error('Error loading custom fields:', error);
        // TODO: Display user-friendly error message
      },
    });
  }

  // Method to get the value for a specific custom field
  getCustomFieldValue(fieldId: string): string | undefined {
    const fieldValue = this.customFieldValues.find(
      (value) => value.field_id === fieldId
    );
    return fieldValue?.value;
  }

  // TODO: Implement methods to handle updating custom field values
  // This will likely involve a form for each custom field and calling updateFieldValue from CustomizationService

  determineValidNextStatuses(): void {
    this.validNextStatuses = []; // Clear previous valid statuses

    if (
      !this.task?.status_id ||
      !this.workflow ||
      this.stages.length === 0 ||
      this.statuses.length === 0
    ) {
      // Cannot determine valid transitions without current status, workflow, stages, or statuses
      return;
    }

    const currentStatus = this.statuses.find(
      (status) => status.id === this.task!.status_id
    );

    if (!currentStatus) {
      console.warn(
        `Current status with ID ${
          this.task!.status_id
        } not found in workflow statuses.`
      );
      return;
    }

    const currentStage = this.stages.find(
      (stage) => stage.id === currentStatus.stage_id
    );

    if (!currentStage) {
      console.warn(
        `Current status's stage with ID ${currentStatus.stage_id} not found in workflow stages.`
      );
      return;
    }

    // Simple logic: allow transition to any status in the current stage with equal or higher order,
    // or any status in a subsequent stage.
    // TODO: Implement more complex workflow rules if needed (e.g., specific allowed transitions)

    this.validNextStatuses = this.statuses.filter((status) => {
      const statusStage = this.stages.find(
        (stage) => stage.id === status.stage_id
      );
      if (!statusStage) {
        return false; // Should not happen if data is consistent
      }

      // Allow transition to the current status itself
      if (status.id === currentStatus.id) {
        return true;
      }

      // Allow transition to statuses in the current stage with equal or higher order
      if (
        statusStage.id === currentStage.id &&
        status.order > currentStatus.order
      ) {
        return true;
      }

      // Allow transition to statuses in subsequent stages
      if (statusStage.order > currentStage.order) {
        return true;
      }

      return false;
    });

    // Optionally, sort valid next statuses by stage order and then status order
    this.validNextStatuses.sort((a, b) => {
      const aStage = this.stages.find((stage) => stage.id === a.stage_id)!;
      const bStage = this.stages.find((stage) => b.stage_id === b.stage_id)!; // Corrected bStage finding
      if (aStage.order !== bStage.order) {
        return aStage.order - bStage.order;
      }
      return a.order - b.order;
    });
  }

  updateTaskStatus(): void {
    if (!this.task?.id || !this.selectedStatusId) {
      return;
    }

    // Check if the selected status is a valid transition (optional, backend also validates)
    const isValidTransition = this.validNextStatuses.some(
      (status) => status.id === this.selectedStatusId
    );
    if (!isValidTransition && this.task.status_id !== this.selectedStatusId) {
      console.warn(
        `Invalid status transition selected for task ${this.task.id}.`
      );
      // TODO: Display user-friendly warning
      // Optionally revert selectedStatusId or prevent update
      // For now, we'll let the backend validation handle it.
    }

    const updatedTask: Partial<Task> = {
      status_id: this.selectedStatusId,
    };

    this.updateTaskSubscription = this.taskService
      .update(this.task.id, updatedTask)
      .subscribe({
        next: (updatedTask: Task) => {
          console.log('Task status updated:', updatedTask);
          // Update the local task object with the returned data
          this.task = updatedTask;
          // Re-determine valid next statuses based on the new status
          this.determineValidNextStatuses();
        },
        error: (error: any) => {
          console.error('Error updating task status:', error);
          // TODO: Display user-friendly error message
          // Optionally revert selectedStatusId on error
        },
      });
  }

  deleteTask(): void {
    if (!this.task?.id) {
      return;
    }

    this.dialogService
      .openConfirmationDialog('Are you sure you want to delete this task?')
      .subscribe((confirmed) => {
        if (confirmed) {
          this.deleteTaskSubscription = this.taskService
            .delete(this.task!.id!)
            .subscribe({
              // Changed remove to delete
              next: () => {
                console.log('Task deleted successfully.');
                // Navigate back to the project details page or task list
                this.router.navigate(['/projects', this.task!.project_id]);
              },
              error: (error: any) => {
                console.error('Error deleting task:', error);
                // TODO: Display user-friendly error message
              },
            });
        }
      });
  }

  ngOnDestroy(): void {
    this.taskSubscription?.unsubscribe();
    this.projectSubscription?.unsubscribe();
    this.workflowDataSubscription?.unsubscribe(); // Unsubscribe from workflow data subscription
    this.customFieldsSubscription?.unsubscribe();
    this.updateTaskSubscription?.unsubscribe(); // Unsubscribe from update task subscription
    this.deleteTaskSubscription?.unsubscribe(); // Unsubscribe from delete task subscription
  }
}
