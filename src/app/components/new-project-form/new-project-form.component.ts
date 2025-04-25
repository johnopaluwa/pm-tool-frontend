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
    private mockDataService: MockDataService // Inject MockDataService
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
            // Store predictions in sessionStorage for now (or use a state service)
            sessionStorage.setItem(
              'latestPredictions',
              JSON.stringify(predictions)
            );
            // Navigate to the detail page of the newly created project
            this.router.navigate(['/projects', newProjectId]);
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
    // Placeholder for draft save logic
    alert('Draft saved (not implemented)');
  }

  onCancel() {
    // Placeholder for cancel logic (e.g., navigate back)
    window.history.back();
  }
}
