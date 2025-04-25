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
          // Generate predictions
          this.predictionService
            .generatePredictions(this.projectForm.value)
            .subscribe({
              next: (predictions: Prediction[]) => {
                this.loading = false;

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
                  .subscribe(() => {
                    // Navigate to the prediction overview page after adding the review
                    this.router.navigate(['/predictions/overview']);
                  });
              },
              error: (err) => {
                this.loading = false;
                this.error =
                  'Failed to generate predictions. Please try again.';
                console.error(err);
              },
            });
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
          alert('Failed to save draft.');
        },
      });
    } else {
      this.projectForm.markAllAsTouched(); // Mark fields as touched to show validation errors
      alert('Please fill in all required fields before saving a draft.'); // Optional: alert user
    }
  }

  onCancel() {
    // Placeholder for cancel logic (e.g., navigate back)
    window.history.back();
  }
}
