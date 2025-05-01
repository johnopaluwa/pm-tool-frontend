import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  PredictionReview,
  PredictionReviewService, // Import PredictionReviewService
} from '../../services/prediction-review.service';
import {
  Prediction,
  PredictionService,
} from '../../services/prediction.service';
import { ProjectService } from '../../services/project.service'; // Import ProjectService

@Component({
  selector: 'app-new-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-project-form.component.html',
  styleUrls: ['./new-project-form.component.css'],
})
export class NewProjectFormComponent {
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
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private projectService: ProjectService, // Inject ProjectService
    private predictionReviewService: PredictionReviewService, // Inject PredictionReviewService
    private predictionService: PredictionService // Inject PredictionService
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
      businessSpecification: [''], // Add new field
      description: [''], // Add description field
      status: ['new'], // Set initial status to 'new'
    });
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
      this.projectService.addProject(this.projectForm.value).subscribe({
        next: (newProjectId) => {
          // Navigate to the project detail page immediately after project creation
          this.router.navigate(['/projects', newProjectId]);

          // Generate predictions and create review in the background
          this.predictionService
            .generatePredictions(this.projectForm.value, newProjectId) // Pass projectData and newProjectId
            .subscribe({
              next: (predictions: Prediction[]) => {
                // Create and add a new prediction review
                const newReview: Omit<PredictionReview, 'id' | 'generatedAt'> =
                  {
                    projectId: newProjectId,
                    projectName: this.projectForm.value.projectName,
                    clientName: this.projectForm.value.clientName,
                    predictions: predictions,
                  };

                this.predictionReviewService
                  .addPredictionReview(newReview)
                  .subscribe({
                    next: () => {
                      console.log('Prediction review created successfully.');
                      // Optionally, you could emit an event or update a shared service
                      // to notify the prediction overview page that new data is available.
                    },
                    error: (err) => {
                      console.error('Failed to add prediction review:', err);
                      // Handle error, maybe show a notification on the overview page
                      // Consider updating status to an error state if needed
                    },
                  });
              },
              error: (err) => {
                console.error('Failed to generate predictions:', err);
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
      this.projectService.addProject(this.projectForm.value).subscribe({
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

  onCancel() {
    // Placeholder for cancel logic (e.g., navigate back)
    window.history.back();
  }
}
