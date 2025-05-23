import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../services/dialog.service'; // Import DialogService
import { StageStatus, WorkflowService } from '../../services/workflow.service'; // Import WorkflowService and StageStatus interface

@Component({
  selector: 'app-stage-status-detail',
  standalone: true, // Mark as standalone
  imports: [CommonModule, ReactiveFormsModule], // Add ReactiveFormsModule
  templateUrl: './stage-status-detail.component.html',
  styleUrl: './stage-status-detail.component.css',
})
export class StageStatusDetailComponent implements OnInit {
  stageStatusForm: FormGroup;
  workflowId: string | null = null;
  stageId: string | null = null;
  statusId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private workflowService: WorkflowService,
    private dialogService: DialogService // Inject DialogService
  ) {
    this.stageStatusForm = this.fb.group({
      name: ['', Validators.required],
      order: [0, [Validators.required, Validators.min(0)]],
      is_default: [false],
      is_completion_status: [false],
    });
  }

  ngOnInit(): void {
    // Access grandparent route for workflowId and parent route for stageId
    this.route.parent!.parent!.paramMap.subscribe((grandparentParams) => {
      this.workflowId = grandparentParams.get('workflowId');
      this.route.parent!.paramMap.subscribe((parentParams) => {
        this.stageId = parentParams.get('stageId');
        this.route.paramMap.subscribe((currentParams) => {
          this.statusId = currentParams.get('statusId');

          console.log(
            'Combined Route params subscribed (grandparent/parent/current):',
            {
              workflowId: this.workflowId,
              stageId: this.stageId,
              statusId: this.statusId,
            }
          );

          if (this.workflowId && this.stageId && this.statusId) {
            // Fetch existing stage status
            this.workflowService
              .getStageStatus(this.workflowId, this.stageId, this.statusId)
              .subscribe((status) => {
                if (status) {
                  this.stageStatusForm.patchValue(status);
                }
              });
          } else {
            // Creating a new stage status, no initial data to patch
          }
        });
      });
    });
  }

  saveStatus(): void {
    if (this.stageStatusForm.valid && this.workflowId && this.stageId) {
      const statusData: StageStatus = {
        ...this.stageStatusForm.value,
        stage_id: this.stageId, // Ensure stage_id is set
      };

      if (this.statusId) {
        // Update existing stage status
        this.workflowService
          .updateStageStatus(
            this.workflowId,
            this.stageId,
            this.statusId,
            statusData
          )
          .subscribe(
            (updatedStatus) => {
              // Optionally navigate back to stage detail or show success message
            },
            (error) => {
              console.error('Error updating stage status:', error);
              // Handle error
            }
          );
      } else {
        // Create new stage status
        this.workflowService
          .createStageStatus(this.workflowId, this.stageId, statusData)
          .subscribe(
            (newStatus) => {
              this.router.navigate([
                '/workflows',
                this.workflowId,
                'stages',
                this.stageId,
              ]); // Navigate back to the stage detail after creation
            },
            (error) => {
              console.error('Error creating stage status:', error);
              // Handle error
            }
          );
      }
    }
  }

  deleteStatus(): void {
    if (this.workflowId && this.stageId && this.statusId) {
      this.dialogService
        .openConfirmationDialog(
          'Are you sure you want to delete this stage status?'
        )
        .subscribe((result: boolean | undefined) => {
          if (result && this.workflowId && this.stageId && this.statusId) {
            this.workflowService
              .deleteStageStatus(this.workflowId, this.stageId, this.statusId)
              .subscribe(
                () => {
                  this.router.navigate([
                    '/workflows',
                    this.workflowId,
                    'stages',
                    this.stageId,
                  ]);
                },
                (error) => {
                  console.error('Error deleting stage status:', error);
                }
              );
          }
        });
    }
  }

  close(): void {
    if (this.workflowId && this.stageId) {
      this.router.navigate([
        '/workflows',
        this.workflowId,
        'stages',
        this.stageId,
      ]);
    } else {
      console.warn('Cannot navigate back, workflowId or stageId is missing.');
    }
  }
}
