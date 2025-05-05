import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  PredictionReview,
  PredictionReviewService,
} from '../../services/prediction-review.service'; // Import PredictionReviewService
import { Prediction } from '../../services/prediction.service'; // Import the updated Prediction interface
import { Project, ProjectService } from '../../services/project.service'; // Import ProjectService and Project

@Component({
  selector: 'app-prediction-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prediction-display.component.html',
  styleUrls: ['./prediction-display.component.css'],
})
export class PredictionDisplayComponent implements OnInit, OnDestroy {
  predictionReview: PredictionReview | undefined; // Store the fetched review
  project: Project | undefined; // Store the associated project
  private queryParamsSubscription: Subscription | undefined;
  private reviewSubscription: Subscription | undefined;
  private projectSubscription: Subscription | undefined;
  private markReportSubscription: Subscription | undefined;
  filteredUserStoryPredictions: Prediction[] = [];
  filteredBugPredictions: Prediction[] = [];
  loading = false;
  error: string | null = null;
  reviewId: string | null = null; // Store the review ID from query params

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private predictionReviewService: PredictionReviewService,
    private projectService: ProjectService // Inject ProjectService
  ) {}

  ngOnInit(): void {
    this.queryParamsSubscription = this.route.queryParams.subscribe(
      (params) => {
        this.reviewId = params['reviewId'] || null; // Get reviewId from query params
        this.loadPredictionReview();
      }
    );
  }

  loadPredictionReview() {
    if (!this.reviewId) {
      this.error = 'No prediction review ID provided.';
      return;
    }

    this.loading = true;
    this.error = null;
    this.reviewSubscription = this.predictionReviewService
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
          // After loading the review, load the associated project
          if (this.predictionReview) {
            this.loadProject(this.predictionReview.projectId);
          }
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Failed to load prediction review.';
          console.error(err);
        },
      });
  }

  loadProject(projectId: number): void {
    this.projectSubscription = this.projectService
      .getProjectById(projectId)
      .subscribe({
        next: (project) => {
          this.project = project;
          console.log('Project loaded:', this.project);
          console.log(
            'Report generated status:',
            this.project?.reportGenerated
          );
        },
        error: (err) => {
          console.error('Failed to load project for review:', err);
          // Optionally set an error message for the project loading
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
    // Mark report as generated for this project
    if (this.predictionReview) {
      this.markReportSubscription = this.projectService
        .markReportGenerated(this.predictionReview.projectId)
        .subscribe({
          next: (updatedProject) => {
            console.log('markReportGenerated success:', updatedProject);
            // Update the local project object with the changes from the backend
            if (this.project && updatedProject) {
              this.project.reportGenerated = updatedProject.reportGenerated;
              this.project.status = updatedProject.status; // Also update status if backend changes it
            }
            console.log(
              `Report marked as generated for project ${this.predictionReview?.projectId}`
            );
            // Navigate to the reports overview page after marking the report as generated
            this.router.navigate(['/reports']);
          },
          error: (err) => {
            console.error('markReportGenerated error:', err);
            this.error = 'Failed to generate report. Please try again.';
            // Optionally show an error message to the user
            // Still navigate to reports page even if marking fails? Depends on desired behavior.
            // For now, navigate anyway.
            this.router.navigate(['/reports']);
          },
        });
    } else {
      console.error(
        'No prediction review available, cannot mark report as generated.'
      );
      // Navigate to reports page even if no review is available
      this.router.navigate(['/reports']);
    }
  }

  viewPredictionDetail(predictionId: string) {
    // This navigation might need adjustment depending on how prediction detail is implemented
    // If prediction detail needs the review context, you might pass reviewId as well
    this.router.navigate(['/predictions/detail', predictionId]);
  }

  viewProjectReport(): void {
    if (this.project) {
      this.router.navigate(['/reports/project', this.project.id]);
    } else {
      console.error('Project not loaded, cannot navigate to report.');
      // Optionally show an error message to the user
    }
  }
  ngOnDestroy(): void {
    this.queryParamsSubscription?.unsubscribe();
    this.reviewSubscription?.unsubscribe();
    this.projectSubscription?.unsubscribe();
    this.markReportSubscription?.unsubscribe();
  }
}
