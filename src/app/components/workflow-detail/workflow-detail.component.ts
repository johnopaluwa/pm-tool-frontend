import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'; // Import form modules
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // Import routing modules and RouterModule
import { of } from 'rxjs'; // Import of
import { switchMap } from 'rxjs/operators'; // Import switchMap
import { DialogService } from '../../services/dialog.service'; // Import DialogService
import { Workflow, WorkflowService } from '../../services/workflow.service'; // Import WorkflowService and Workflow interface
import { WorkflowStageListComponent } from '../workflow-stage-list/workflow-stage-list.component'; // Import WorkflowStageListComponent

@Component({
  selector: 'app-workflow-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WorkflowStageListComponent,
    RouterModule,
  ], // Add ReactiveFormsModule, WorkflowStageListComponent, and RouterModule
  templateUrl: './workflow-detail.component.html',
  styleUrl: './workflow-detail.component.css',
})
export class WorkflowDetailComponent implements OnInit {
  workflowForm: FormGroup;
  workflowId: string | null = null;
  isChildRouteActive: boolean = false; // Property to track if a child route is active

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private workflowService: WorkflowService,
    private dialogService: DialogService // Inject DialogService
  ) {
    this.workflowForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });

    // Subscribe to router events to detect child route activation
    this.router.events.subscribe(() => {
      this.isChildRouteActive =
        !!this.route.snapshot.firstChild?.paramMap.has('stageId') ||
        this.route.snapshot.firstChild?.url.some(
          (segment) => segment.path === 'new'
        ) ||
        this.route.snapshot.url.some((segment) => segment.path === 'new');
    });
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.workflowId = params.get('workflowId');
          this.isChildRouteActive =
            !!this.route.snapshot.firstChild?.paramMap.has('stageId') ||
            this.route.snapshot.firstChild?.url.some(
              (segment) => segment.path === 'new'
            ) ||
            this.route.snapshot.url.some((segment) => segment.path === 'new'); // Set initial value based on route snapshot
          if (this.workflowId) {
            // Fetch existing workflow
            return this.workflowService.getWorkflow(this.workflowId);
          } else {
            // Creating a new workflow
            return of(null);
          }
        })
      )
      .subscribe((workflow) => {
        if (workflow) {
          this.workflowForm.patchValue(workflow);
        }
      });
  }

  saveWorkflow(): void {
    if (this.workflowForm.valid) {
      const workflowData: Workflow = this.workflowForm.value;
      if (this.workflowId) {
        // Update existing workflow
        this.workflowService
          .updateWorkflow(this.workflowId, workflowData)
          .subscribe(
            (updatedWorkflow) => {
              // Optionally navigate back to list or show success message
            },
            (error) => {
              console.error('Error updating workflow:', error);
              // Handle error
            }
          );
      } else {
        // Create new workflow
        this.workflowService.createWorkflow(workflowData).subscribe(
          (newWorkflow) => {
            this.router.navigate(['/workflows', newWorkflow.id]); // Navigate to the new workflow's detail page
          },
          (error) => {
            console.error('Error creating workflow:', error);
            // Handle error
          }
        );
      }
    }
  }

  deleteWorkflow(): void {
    if (this.workflowId) {
      this.dialogService
        .openConfirmationDialog(
          'Are you sure you want to delete this workflow?'
        )
        .subscribe((confirmed: boolean | undefined) => {
          if (confirmed) {
            this.workflowService.deleteWorkflow(this.workflowId!).subscribe(
              () => {
                this.router.navigate(['/workflows/list']); // Navigate back to the list after deletion
              },
              (error) => {
                console.error('Error deleting workflow:', error);
                // Handle error
              }
            );
          }
        });
    }
  }

  close(): void {
    this.router.navigate(['/workflows']); // Navigate back to the workflow overview
  }
}
