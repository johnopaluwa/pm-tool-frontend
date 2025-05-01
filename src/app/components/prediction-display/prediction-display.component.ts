import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PredictionReview,
  PredictionReviewService,
} from '../../services/prediction-review.service'; // Import PredictionReviewService
import { Prediction } from '../../services/prediction.service'; // Import the updated Prediction interface

@Component({
  selector: 'app-prediction-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prediction-display.component.html',
  styleUrls: ['./prediction-display.component.css'],
})
export class PredictionDisplayComponent implements OnInit {
  predictionReview: PredictionReview | undefined; // Store the fetched review
  filteredUserStoryPredictions: Prediction[] = [];
  filteredBugPredictions: Prediction[] = [];
  loading = false;
  error: string | null = null;
  reviewId: string | null = null; // Store the review ID from query params

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private predictionReviewService: PredictionReviewService
  ) {} // Inject PredictionReviewService

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.reviewId = params['reviewId'] || null; // Get reviewId from query params
      this.loadPredictionReview();
    });
  }

  loadPredictionReview() {
    if (!this.reviewId) {
      this.error = 'No prediction review ID provided.';
      return;
    }

    this.loading = true;
    this.error = null;
    this.predictionReviewService
      .getPredictionReviewById(this.reviewId)
      .subscribe({
        next: (review) => {
          this.loading = false;
          this.predictionReview = review;
          if (review) {
            // Initialize isCollapsed to true for all predictions
            review.predictions.forEach((pred) => (pred.isCollapsed = true));
            // Use 'user-story' to match the updated backend model
            this.filteredUserStoryPredictions = review.predictions.filter(
              (p) => p.type === 'user-story'
            );
            this.filteredBugPredictions = review.predictions.filter(
              (p) => p.type === 'bug'
            );
          } else {
            this.error = `Prediction review with ID "${this.reviewId}" not found.`;
          }
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Failed to load prediction review.';
          console.error(err);
        },
      });
  }

  // Method to toggle acceptance status based on checkbox
  toggleAcceptance(pred: Prediction, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (this.predictionReview) {
      const predictionToUpdate = this.predictionReview.predictions.find(
        (p) => p.id === pred.id
      );
      if (predictionToUpdate) {
        predictionToUpdate.status = isChecked ? 'accepted' : 'rejected';
        // Optionally, call a service method here to update the backend
        // this.predictionReviewService.updatePredictionStatus(predictionToUpdate.id, predictionToUpdate.status).subscribe();
      }
    }
  }

  // Existing methods (placeholders or actual logic)
  acceptPrediction(pred: Prediction) {
    // This method might become redundant with the checkbox,
    // but keeping it for now based on original code.
    // Logic can be merged with toggleAcceptance if needed.
    if (this.predictionReview) {
      const predictionToUpdate = this.predictionReview.predictions.find(
        (p) => p.id === pred.id
      );
      if (predictionToUpdate) {
        predictionToUpdate.status = 'accepted';
      }
    }
  }

  rejectPrediction(pred: Prediction) {
    // This method might become redundant with the checkbox,
    // but keeping it for now based on original code.
    // Logic can be merged with toggleAcceptance if needed.
    if (this.predictionReview) {
      const predictionToUpdate = this.predictionReview.predictions.find(
        (p) => p.id === pred.id
      );
      if (predictionToUpdate) {
        predictionToUpdate.status = 'rejected';
      }
    }
  }

  editPrediction(pred: Prediction) {
    // Placeholder for edit logic (could open a modal)
    // If implemented, update the prediction in the local review object and potentially in the service
  }

  finishReview() {
    // Placeholder for finish logic (could send feedback to backend via service)
    // In a real app, you might call a service method here to save the reviewed predictions
    this.router.navigate(['/reports']); // Navigate to the reports page
  }

  viewPredictionDetail(predictionId: string) {
    // This navigation might need adjustment depending on how prediction detail is implemented
    // If prediction detail needs the review context, you might pass reviewId as well
    this.router.navigate(['/predictions/detail', predictionId]);
  }
}
