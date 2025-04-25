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
import { MockDataService } from '../../services/mock-data.service';
import {
  MockPredictionReviewService, // Import MockPredictionReviewService
  PredictionReview,
} from '../../services/mock-prediction-review.service';
import {
  Prediction,
  PredictionService,
} from '../../services/prediction.service';

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
    private predictionService: PredictionService,
    private router: Router,
    private mockDataService: MockDataService, // Inject MockDataService
    private mockPredictionReviewService: MockPredictionReviewService // Inject MockPredictionReviewService
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

      // Add the new project to mock data
      const newProjectId = this.mockDataService.addProject(
        this.projectForm.value
      );

      // Generate predictions (still using mock for now)
      this.predictionService
        .generatePredictions(this.projectForm.value)
        .subscribe({
          next: (predictions: Prediction[]) => {
            this.loading = false;

            // Create and add a new prediction review
            const newReview: Omit<PredictionReview, 'id' | 'generatedAt'> = {
              projectId: newProjectId,
              projectName: this.projectForm.value.projectName,
              clientName: this.projectForm.value.clientName,
              predictions: predictions,
            };

            this.mockPredictionReviewService
              .addPredictionReview(newReview)
              .subscribe(() => {
                // Navigate to the prediction overview page after adding the review
                this.router.navigate(['/predictions/overview']);
              });
          },
          error: (err) => {
            this.loading = false;
            this.error = 'Failed to generate predictions. Please try again.';
          },
        });
    } else {
      this.projectForm.markAllAsTouched();
    }
  }

  onSaveDraft() {
    if (this.projectForm.valid) {
      // Check form validity before saving draft
      // Add the new project to mock data
      const newProjectId = this.mockDataService.addProject(
        this.projectForm.value
      );

      // Navigate to the detail page of the newly created project
      this.router.navigate(['/projects', newProjectId]);
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
