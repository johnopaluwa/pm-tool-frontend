import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // Import Router
import { forkJoin, Observable, of, Subscription } from 'rxjs'; // Import Observable and of

import { FormsModule } from '@angular/forms';

import {
  CustomFieldDefinition,
  CustomFieldValue,
  CustomizationService,
} from '../../services/customization.service';
import {
  PredictionReview,
  PredictionReviewService,
} from '../../services/prediction-review.service';
import { PredictionService } from '../../services/prediction.service';
import { Project, ProjectService } from '../../services/project.service';
import { Workflow, WorkflowService } from '../../services/workflow.service'; // Import WorkflowService and Workflow interface

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  project: Project | undefined;
  predictionReviews: PredictionReview[] = [];
  customFieldDefinitions: CustomFieldDefinition[] = [];
  customFieldValues: CustomFieldValue[] = [];
  editingFieldId: string | null = null;
  editingFieldValue: string | undefined = undefined;

  workflows$!: Observable<Workflow[]>; // Observable to hold available workflows
  selectedWorkflowId: string | null = null; // To hold the selected workflow ID for the project

  private projectSubscription: Subscription | undefined;
  private reviewsSubscription: Subscription | undefined;
  private generatePredictionsSubscription: Subscription | undefined;
  private customFieldsSubscription: Subscription | undefined;
  private updateFieldValueSubscription: Subscription | undefined;
  private updateProjectSubscription: Subscription | undefined; // Subscription for updating project

  generatingPredictions = false;
  predictionError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Inject Router for navigation
    private projectService: ProjectService,
    private predictionReviewService: PredictionReviewService,
    private predictionService: PredictionService,
    private customizationService: CustomizationService,
    private workflowService: WorkflowService // Inject WorkflowService
  ) {}

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      // Fetch project details and available workflows in parallel
      this.projectSubscription = forkJoin([
        this.projectService.getProjectById(projectId),
        this.workflowService.getWorkflows(), // Fetch all workflows
      ]).subscribe({
        next: ([project, workflows]) => {
          this.project = project;
          this.workflows$ = of(workflows); // Assign workflows to the observable

          if (project) {
            this.selectedWorkflowId = project.workflow_id || null; // Set selected workflow ID
            this.loadCustomFields(projectId); // Load custom fields after project is loaded
            // Fetch prediction reviews for this project
            this.reviewsSubscription = this.predictionReviewService
              .getPredictionReviewsByProjectId(projectId)
              .subscribe((reviews: PredictionReview[]) => {
                this.predictionReviews = reviews;
              });
          } else {
            // Project not found, navigate back or show error
            this.router.navigate(['/projects']);
          }
        },
        error: (error) => {
          console.error('Error loading project or workflows:', error);
          // TODO: Display user-friendly error message
        },
      });
    }
  }

  loadCustomFields(projectId: string): void {
    // TODO: Determine how to get the organizationId in the frontend.
    // For now, assuming backend handles organization scoping for field definitions.
    // Fetch both definitions and values in parallel
    this.customFieldsSubscription = forkJoin([
      this.customizationService.getFieldDefinitions('project'), // Fetch definitions for 'project' entity type
      this.customizationService.getFieldValuesForEntity('project', projectId), // Fetch values for this specific project
    ]).subscribe({
      next: ([definitions, values]) => {
        // Filter definitions to only include those for projects
        this.customFieldDefinitions = definitions.filter(
          (def) => def.entity_type === 'project'
        );
        this.customFieldValues = values;
        console.log(
          'Custom field definitions received (filtered):',
          this.customFieldDefinitions
        ); // Log filtered definitions
        this.customFieldDefinitions.forEach((def) =>
          console.log(
            `Definition ID: ${def.id}, Name: ${def.name}, Entity Type: ${def.entity_type}`
          )
        ); // Log details of each filtered definition
        console.log('Custom field values:', this.customFieldValues);
      },
      error: (error) => {
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

  // Methods for inline editing of custom field values
  isEditingField(fieldId: string): boolean {
    return this.editingFieldId === fieldId;
  }

  startEditingField(field: CustomFieldDefinition): void {
    this.editingFieldId = field.id!;
    // Find the current value for this field
    const currentValue = this.customFieldValues.find(
      (value) => value.field_id === field.id
    );
    this.editingFieldValue = currentValue?.value;
  }

  saveCustomFieldValue(fieldId: string): void {
    if (!this.project || !this.editingFieldId) {
      return; // Should not happen if UI is correct
    }

    const existingValue = this.customFieldValues.find(
      (value) =>
        value.field_id === fieldId && value.entity_id === this.project!.id
    );

    if (existingValue) {
      // Update existing value
      this.updateFieldValueSubscription = this.customizationService
        .updateFieldValue(existingValue.id!, { value: this.editingFieldValue })
        .subscribe({
          next: (updatedValue) => {
            // Update the value in the local array
            const index = this.customFieldValues.findIndex(
              (value) => value.id === updatedValue.id
            );
            if (index !== -1) {
              this.customFieldValues[index] = updatedValue;
            }
            this.cancelEditingField();
          },
          error: (error) => {
            console.error('Error updating custom field value:', error);
            // TODO: Display user-friendly error message
          },
        });
    } else {
      // Create new value
      const newFieldValue: CustomFieldValue = {
        field_id: fieldId,
        entity_id: this.project.id!,
        value: this.editingFieldValue,
      };
      this.updateFieldValueSubscription = this.customizationService
        .createFieldValue(newFieldValue)
        .subscribe({
          next: (createdValue) => {
            this.customFieldValues.push(createdValue);
            this.cancelEditingField();
          },
          error: (error) => {
            console.error('Error creating custom field value:', error);
            // TODO: Display user-friendly error message
          },
        });
    }
  }

  cancelEditingField(): void {
    this.editingFieldId = null;
    this.editingFieldValue = undefined;
  }

  generatePredictions(): void {
    if (!this.project) {
      this.predictionError =
        'Cannot generate predictions: Project data not loaded.';
      return;
    }

    this.generatingPredictions = true;
    this.predictionError = null;

    // Use project data to generate and save predictions and review
    this.generatePredictionsSubscription = this.predictionService
      .generateAndSavePredictionReview(this.project, this.project.id!) // Use the new combined method
      .subscribe({
        next: (addedReview: PredictionReview) => {
          this.generatingPredictions = false;
          // Add the new review to the local array to update the display
          this.predictionReviews.push(addedReview);
          console.log(
            'Prediction review and predictions generated and saved successfully:',
            addedReview
          );
        },
        error: (err: any) => {
          this.generatingPredictions = false;
          this.predictionError =
            'Failed to generate and save prediction review. Please try again.';
          console.error(err);
        },
      });
  }

  updateProjectWorkflow(): void {
    if (!this.project || this.selectedWorkflowId === undefined) {
      return;
    }

    // Create a partial project object with only the workflow_id to update
    const updatedProject: Partial<Project> = {
      workflow_id: this.selectedWorkflowId,
    };

    this.updateProjectSubscription = this.projectService
      .updateProject(this.project.id!, updatedProject)
      .subscribe({
        next: (project: Project) => {
          // Explicitly type project
          console.log('Project workflow updated:', project);
          // Update the local project object with the returned data
          this.project = project;
        },
        error: (error: any) => {
          // Explicitly type error
          console.error('Error updating project workflow:', error);
          // TODO: Display user-friendly error message
        },
      });
  }

  ngOnDestroy(): void {
    this.projectSubscription?.unsubscribe();
    this.reviewsSubscription?.unsubscribe();
    this.generatePredictionsSubscription?.unsubscribe();
    this.customFieldsSubscription?.unsubscribe();
    this.updateFieldValueSubscription?.unsubscribe();
    this.updateProjectSubscription?.unsubscribe(); // Unsubscribe from update project subscription
  }
}
