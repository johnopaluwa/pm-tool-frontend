import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { of, Subject } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DialogService } from '../../services/dialog.service';
import {
  WorkflowService,
  WorkflowStage,
} from '../../services/workflow.service';

import { StageStatusListComponent } from '../stage-status-list/stage-status-list.component';

@Component({
  selector: 'app-workflow-stage-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StageStatusListComponent,
    RouterModule,
  ],
  templateUrl: './workflow-stage-detail.component.html',
  styleUrl: './workflow-stage-detail.component.css',
})
export class WorkflowStageDetailComponent implements OnInit, OnDestroy {
  workflowStageForm: FormGroup;
  workflowId: string | null = null;
  stageId: string | null = null;
  isEditingStatus: boolean = false; // Add property to track if editing/creating status

  private destroy$ = new Subject<void>(); // Subject to manage subscriptions

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private workflowService: WorkflowService,
    private dialogService: DialogService
  ) {
    this.workflowStageForm = this.fb.group({
      name: ['', Validators.required],
      order: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.route
      .parent!.paramMap // Access parent route parameters
      .pipe(
        tap((parentParams) => {
          this.workflowId = parentParams.get('workflowId'); // Get workflowId from parent route
        }),
        switchMap(() => this.route.paramMap), // Then switch to current route parameters for stageId
        tap((params) => {
          this.stageId = params.get('stageId'); // Get stageId from current route
          console.log('WorkflowStageDetailComponent ngOnInit subscribed:', {
            workflowId: this.workflowId,
            stageId: this.stageId,
          });
          // Initialize isEditingStatus based on the current URL on load
          const statusRoutePattern =
            /\/statuses\/(new|[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
          this.isEditingStatus = statusRoutePattern.test(this.router.url);
        }),
        switchMap(() => {
          if (this.workflowId && this.stageId) {
            // Fetch existing workflow stage
            console.log(
              'Fetching existing stage:',
              this.workflowId,
              this.stageId
            ); // Log fetch action
            return this.workflowService.getWorkflowStage(
              this.workflowId,
              this.stageId
            );
          } else {
            // Creating a new workflow stage
            return of(null);
          }
        }),
        takeUntil(this.destroy$) // Unsubscribe on destroy
      )
      .subscribe((stage) => {
        if (stage) {
          this.workflowStageForm.patchValue(stage);
        } else {
        }
      });

    // Subscribe to router events to update isEditingStatus
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        // Check if the current URL matches the status detail or new status route
        // Use a regex to check for '/statuses/new' or '/statuses/:statusId' at the end of the URL
        const statusRoutePattern =
          /\/statuses\/(new|[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
        this.isEditingStatus = statusRoutePattern.test(event.url);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  saveStage(): void {
    if (this.workflowStageForm.valid && this.workflowId) {
      const stageData: WorkflowStage = {
        ...this.workflowStageForm.value,
        workflow_id: this.workflowId,
      };

      if (this.stageId) {
        // Update existing workflow stage
        this.workflowService
          .updateWorkflowStage(this.workflowId, this.stageId, stageData)
          .subscribe(
            (updatedStage) => {
              this.router.navigate(['/workflows', this.workflowId]);
            },
            (error) => {
              console.error('Error updating workflow stage:', error);
              // Handle error
            }
          );
      } else {
        // Create new workflow stage
        this.workflowService
          .createWorkflowStage(this.workflowId, stageData)
          .subscribe(
            (newStage) => {
              this.router.navigate(['/workflows', this.workflowId]);
            },
            (error) => {
              console.error('Error creating workflow stage:', error);
              // Handle error
            }
          );
      }
    } else {
      console.warn(
        'Save Stage aborted: Form is invalid or workflowId is missing.'
      );
    }
  }

  close(): void {
    this.router.navigate(['/workflows', this.workflowId]);
  }

  deleteStage(): void {
    if (this.workflowId && this.stageId) {
      this.dialogService
        .openConfirmationDialog(
          'Are you sure you want to delete this workflow stage?'
        )
        .subscribe((confirmed: boolean | undefined) => {
          if (confirmed) {
            this.workflowService
              .deleteWorkflowStage(this.workflowId!, this.stageId!)
              .subscribe(
                () => {
                  this.router.navigate(['/workflows', this.workflowId]);
                },
                (error) => {
                  console.error('Error deleting workflow stage:', error);
                  // Handle error
                }
              );
          }
        });
    }
  }
}
