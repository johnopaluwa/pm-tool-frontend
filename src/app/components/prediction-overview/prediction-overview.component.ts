import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  PredictionReview,
  PredictionReviewService,
} from '../../services/prediction-review.service'; // Import PredictionReviewService
import { Prediction } from '../../services/prediction.service'; // Assuming Prediction interface is here or in a shared model file

@Component({
  selector: 'app-prediction-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prediction-overview.component.html',
  styleUrl: './prediction-overview.component.css',
})
export class PredictionOverviewComponent implements OnInit {
  groupedPredictions: { [project: string]: Prediction[] } = {}; // Still group predictions for display
  predictionReviews: PredictionReview[] = []; // Store the full reviews
  loading = false;
  error: string | null = null;

  get projectKeys(): string[] {
    return Object.keys(this.groupedPredictions);
  }

  constructor(
    private router: Router,
    private predictionReviewService: PredictionReviewService
  ) {} // Inject PredictionReviewService

  ngOnInit(): void {
    this.loadRecentPredictions(); // Load predictions when the component initializes
  }

  loadRecentPredictions() {
    this.loading = true;
    this.error = null;
    this.predictionReviewService.getPredictionReviews().subscribe({
      next: (reviews) => {
        this.predictionReviews = reviews;
        // Group predictions from all reviews by project name for display
        this.groupedPredictions = reviews.reduce((acc, review) => {
          if (!acc[review.projectName]) {
            acc[review.projectName] = [];
          }
          acc[review.projectName].push(...review.predictions);
          return acc;
        }, {} as { [project: string]: Prediction[] });
        this.loading = false;
        if (this.projectKeys.length === 0) {
          this.error = 'No recent prediction activity found.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load prediction reviews.';
        console.error(err);
      },
    });
  }

  reviewPredictions(projectName: string) {
    // Find the review ID for the given project name
    const review = this.predictionReviews.find(
      (r) => r.projectName === projectName
    );
    if (review) {
      // Navigate to the detailed prediction list page, passing the review ID
      this.router.navigate(['/predictions/list'], {
        queryParams: { reviewId: review.id },
      });
    } else {
      console.error('Review not found for project:', projectName);
      // Optionally show an error message to the user
    }
  }
}
