import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MockPredictionReviewService,
  PredictionReview,
} from '../../services/mock-prediction-review.service'; // Import MockPredictionReviewService
import { Prediction } from '../../services/prediction.service';

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
    private mockPredictionReviewService: MockPredictionReviewService
  ) {} // Inject MockPredictionReviewService

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
    this.mockPredictionReviewService
      .getPredictionReviewById(this.reviewId)
      .subscribe({
        next: (review) => {
          this.loading = false;
          this.predictionReview = review;
          if (review) {
            this.filteredUserStoryPredictions = review.predictions.filter(
              (p) => p.type === 'userStory'
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

  acceptPrediction(pred: Prediction) {
    // Update status in the local review object
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
    // Update status in the local review object
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
    alert('Edit functionality not implemented yet.');
    // If implemented, update the prediction in the local review object and potentially in the service
  }

  finishReview() {
    // Placeholder for finish logic (could send feedback to backend via service)
    alert('Review finished! (Feedback not yet sent to backend)');
    // In a real app, you might call a service method here to save the reviewed predictions
    this.router.navigate(['/predictions/overview']); // Navigate back to overview
  }

  viewPredictionDetail(predictionId: string) {
    // This navigation might need adjustment depending on how prediction detail is implemented
    // If prediction detail needs the review context, you might pass reviewId as well
    this.router.navigate(['/predictions/detail', predictionId]);
  }
}
