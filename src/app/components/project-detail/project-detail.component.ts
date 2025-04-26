import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router'; // Import RouterModule
import {
  PredictionReview,
  PredictionReviewService,
} from '../../services/prediction-review.service'; // Import PredictionReviewService
import {
  Prediction,
  PredictionService,
} from '../../services/prediction.service'; // Import PredictionService and Prediction
import { Project, ProjectService } from '../../services/project.service'; // Import ProjectService and Project interface

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule], // Import RouterModule
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
})
export class ProjectDetailComponent {
  project: Project | undefined; // Define Project interface
  predictionReviews: PredictionReview[] = []; // Property to store prediction reviews for this project
  generatingPredictions = false; // Loading state for prediction generation
  predictionError: string | null = null; // Error state for prediction generation

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService, // Inject ProjectService
    private predictionReviewService: PredictionReviewService, // Inject PredictionReviewService
    private predictionService: PredictionService // Inject PredictionService
  ) {}

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      const id = +projectId; // Convert string ID to number
      this.projectService.getProjectById(id).subscribe((project) => {
        this.project = project;
      });

      // Fetch prediction reviews for this project
      this.predictionReviewService
        .getPredictionReviewsByProjectId(id)
        .subscribe((reviews: PredictionReview[]) => {
          this.predictionReviews = reviews;
        });
    }
  }

  generatePredictions(): void {
    if (!this.project) {
      this.predictionError =
        'Cannot generate predictions: Project data not loaded.';
      return;
    }

    this.generatingPredictions = true;
    this.predictionError = null;

    // Use project data to generate predictions
    this.predictionService
      .generatePredictions(this.project, this.project.id)
      .subscribe({
        next: (predictions: Prediction[]) => {
          // Create a new prediction review
          const newReview: Omit<PredictionReview, 'id' | 'generatedAt'> = {
            projectId: this.project!.id,
            projectName: this.project!.name,
            clientName: this.project!.client,
            predictions: predictions,
          };

          // Add the new review using the PredictionReviewService
          this.predictionReviewService
            .addPredictionReview(newReview)
            .subscribe({
              next: (addedReview: PredictionReview) => {
                this.generatingPredictions = false;
                // Add the new review to the local array to update the display
                this.predictionReviews.push(addedReview);
              },
              error: (err: any) => {
                this.generatingPredictions = false;
                this.predictionError = 'Failed to save prediction review.';
                console.error(err);
              },
            });
        },
        error: (err: any) => {
          this.generatingPredictions = false;
          this.predictionError =
            'Failed to generate predictions. Please try again.';
          console.error(err);
        },
      });
  }
}
