import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core'; // Import OnInit
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs'; // Import Observable
import { PredictionReview } from '../../services/prediction-review.service';
import { PredictionService } from '../../services/prediction.service';
import { ProjectService } from '../../services/project.service';
import { Workflow, WorkflowService } from '../../services/workflow.service'; // Import WorkflowService and Workflow interface

@Component({
  selector: 'app-new-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-project-form.component.html',
  styleUrls: ['./new-project-form.component.css'],
})
export class NewProjectFormComponent implements OnInit, OnDestroy {
  // Implement OnInit
  projectForm: FormGroup;
  techStackOptions = [
    'React',
    'Angular',
    'Vue',
    'Node',
    'Python',
    'AWS',
    'Azure',
    'Other',
  ];
  workflows$!: Observable<Workflow[]>; // Observable to hold workflows
  private addProjectSubscription: Subscription | undefined;
  private generateReviewSubscription: Subscription | undefined;
  private saveDraftSubscription: Subscription | undefined;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private projectService: ProjectService,
    private predictionService: PredictionService,
    private workflowService: WorkflowService // Inject WorkflowService
  ) {
    this.projectForm = this.fb.group({
      projectName: ['', Validators.required],
      clientName: [''],
      projectType: ['', Validators.required],
      clientIndustry: ['', Validators.required],
      techStack: this.fb.array([], Validators.required),
      teamSize: ['', Validators.required],
      duration: ['', Validators.required],
      keywords: [''],
      businessSpecification: [''],
      description: [''],
      status: ['new'],
      workflow_id: [null], // Add workflow_id form control
    });
  }

  ngOnInit(): void {
    this.workflows$ = this.workflowService.getWorkflows(); // Fetch workflows on init
  }

  onTechStackChange(event: any) {
    const techStack: FormArray = this.projectForm.get('techStack') as FormArray;
    if (event.target.checked) {
      techStack.push(this.fb.control(event.target.value));
    } else {
      const idx = techStack.controls.findIndex(
        (x) => x.value === event.target.value
      );
      if (idx >= 0) techStack.removeAt(idx);
    }
  }

  onSubmit() {
    if (this.projectForm.valid) {
      this.loading = true;
      this.error = null;

      // Add the new project using the ProjectService
      this.addProjectSubscription = this.projectService
        .addProject(this.projectForm.value)
        .subscribe({
          next: (newProjectId) => {
            // Navigate to the project detail page immediately after project creation
            this.router.navigate(['/projects', newProjectId]);

            // Generate predictions and save review in the background using the new combined endpoint
            this.generateReviewSubscription = this.predictionService
              .generateAndSavePredictionReview(
                this.projectForm.value,
                newProjectId
              )
              .subscribe({
                next: (predictionReview: PredictionReview) => {
                  console.log(
                    'Prediction review and predictions created successfully:',
                    predictionReview
                  );
                  // Optionally, you could emit an event or update a shared service
                  // to notify the prediction overview page that new data is available.
                },
                error: (err) => {
                  console.error(
                    'Failed to generate and save prediction review:',
                    err
                  );
                  // Handle error, maybe show a notification on the overview page
                  // Consider updating status to an error state if needed
                },
              });

            this.loading = false; // Set loading to false after navigation starts
          },
          error: (err) => {
            this.loading = false;
            this.error = 'Failed to add project. Please try again.';
            console.error(err);
          },
        });
    } else {
      this.projectForm.markAllAsTouched();
    }
  }

  onSaveDraft() {
    if (this.projectForm.valid) {
      // Check form validity before saving draft
      // Add the new project using the ProjectService
      this.saveDraftSubscription = this.projectService
        .addProject(this.projectForm.value)
        .subscribe({
          next: (newProjectId) => {
            // Navigate to the detail page of the newly created project
            this.router.navigate(['/projects', newProjectId]);
          },
          error: (err) => {
            console.error(err);
            // TODO: Replace alert with a notification service
          },
        });
    } else {
      this.projectForm.markAllAsTouched(); // Mark fields as touched to show validation errors
      // Validation errors are handled by Angular forms, no need for an alert
    }
  }

  ngOnDestroy(): void {
    this.addProjectSubscription?.unsubscribe();
    this.generateReviewSubscription?.unsubscribe();
    this.saveDraftSubscription?.unsubscribe();
  }

  onCancel() {
    // Placeholder for cancel logic (e.g., navigate back)
    window.history.back();
  }
}
