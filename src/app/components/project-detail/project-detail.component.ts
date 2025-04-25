import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router'; // Import RouterModule
import { MockDataService } from '../../services/mock-data.service';
import {
  MockPredictionReviewService,
  PredictionReview,
} from '../../services/mock-prediction-review.service'; // Import MockPredictionReviewService
import {
  Prediction,
  PredictionService,
} from '../../services/prediction.service'; // Import PredictionService and Prediction

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule], // Import RouterModule
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
})
export class ProjectDetailComponent {
  project: any; // Or define a Project interface
  predictionReviews: PredictionReview[] = []; // Property to store prediction reviews for this project
  generatingPredictions = false; // Loading state for prediction generation
  predictionError: string | null = null; // Error state for prediction generation

  constructor(
    private route: ActivatedRoute,
    private mockDataService: MockDataService,
    private mockPredictionReviewService: MockPredictionReviewService, // Inject MockPredictionReviewService
    private predictionService: PredictionService // Inject PredictionService
  ) {}

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      const id = +projectId; // Convert string ID to number
      this.project = this.mockDataService.getProjectById(id);

      // Fetch prediction reviews for this project
      this.mockPredictionReviewService
        .getPredictionReviewsByProjectId(id)
        .subscribe((reviews) => {
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
    this.predictionService.generatePredictions(this.project).subscribe({
      next: (predictions: Prediction[]) => {
        // Create a new prediction review
        const newReview: Omit<PredictionReview, 'id' | 'generatedAt'> = {
          projectId: this.project.id,
          projectName: this.project.name,
          clientName: this.project.client,
          predictions: predictions,
        };

        // Add the new review to the mock service
        this.mockPredictionReviewService
          .addPredictionReview(newReview)
          .subscribe({
            next: (addedReview) => {
              this.generatingPredictions = false;
              // Add the new review to the local array to update the display
              this.predictionReviews.push(addedReview);
            },
            error: (err) => {
              this.generatingPredictions = false;
              this.predictionError = 'Failed to save prediction review.';
              console.error(err);
            },
          });
      },
      error: (err) => {
        this.generatingPredictions = false;
        this.predictionError =
          'Failed to generate predictions. Please try again.';
        console.error(err);
      },
    });
  }
}
