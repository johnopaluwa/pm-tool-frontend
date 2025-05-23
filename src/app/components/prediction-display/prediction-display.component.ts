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
import { ReportService } from '../../services/report.service'; // Import ReportService

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
  isGeneratingReport = false; // New property for report generation loading
  error: string | null = null;
  reviewId: string | null = null; // Store the review ID from query params

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private predictionReviewService: PredictionReviewService,
    private projectService: ProjectService, // Inject ProjectService
    private reportService: ReportService // Inject ReportService
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

  loadProject(projectId: string): void {
    this.projectSubscription = this.projectService
      .getProjectById(projectId)
      .subscribe({
        next: (project) => {
          this.project = project;
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
    if (!this.predictionReview) {
      console.error('No prediction review available, cannot generate report.');
      this.error = 'No prediction review available.';
      return;
    }

    this.loading = true; // Keep this for initial review loading if needed elsewhere
    this.isGeneratingReport = true; // Set generating report flag
    this.error = null;

    // Call the report service to generate project reports (backend will also mark as generated)
    this.markReportSubscription = this.reportService
      .generateProjectReports(this.predictionReview.projectId)
      .subscribe({
        next: (reportResponse) => {
          this.loading = false; // Reset initial loading flag
          this.isGeneratingReport = false; // Reset generating report flag
          // Optionally refetch the project to update the reportGenerated status in the UI
          if (this.project) {
            this.loadProject(this.project.id);
          }
          console.log(
            `Report generation completed for project ${this.predictionReview?.projectId}`
          );
          // Navigate to the reports overview page after report generation
          this.router.navigate(['/reports']);
        },
        error: (reportErr) => {
          this.loading = false; // Reset initial loading flag
          this.isGeneratingReport = false; // Reset generating report flag
          console.error('generateProjectReports error:', reportErr);
          this.error = 'Failed to generate report. Please try again.';
          // Optionally show an error message to the user
          // Do not navigate if report generation fails, as the report won't exist
        },
      });
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
