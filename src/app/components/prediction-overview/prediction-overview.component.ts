import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, of, Subscription } from 'rxjs';
import { catchError, startWith, switchMap } from 'rxjs/operators';
import {
  PredictionReview,
  PredictionReviewService,
} from '../../services/prediction-review.service'; // Import PredictionReviewService
import { Prediction } from '../../services/prediction.service'; // Assuming Prediction interface is here or in a shared model file
import { Project, ProjectService } from '../../services/project.service'; // Import ProjectService and Project
import { ReportService } from '../../services/report.service'; // Import ReportService

@Component({
  selector: 'app-prediction-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prediction-overview.component.html',
  styleUrl: './prediction-overview.component.css',
})
export class PredictionOverviewComponent implements OnInit, OnDestroy {
  groupedPredictions: { [project: string]: Prediction[] } = {}; // Still group predictions for display
  predictionReviews: PredictionReview[] = []; // Store the full reviews
  loading = false;
  error: string | null = null;
  projectReportStatus: {
    [projectId: number]: 'pending' | 'generating' | 'completed' | 'failed';
  } = {}; // Store report status for each project
  private statusSubscriptions: { [projectId: number]: Subscription } = {};
  private projectsSubscription: Subscription | undefined;
  private reviewsSubscription: Subscription | undefined;

  get projectKeys(): string[] {
    return Object.keys(this.groupedPredictions);
  }

  constructor(
    private router: Router,
    private predictionReviewService: PredictionReviewService,
    private projectService: ProjectService, // Inject ProjectService
    private reportService: ReportService // Inject ReportService
  ) {}

  ngOnInit(): void {
    this.loadRecentPredictions(); // Load predictions when the component initializes
    this.loadProjects(); // Load projects to get status
  }

  ngOnDestroy(): void {
    // Unsubscribe from all status subscriptions
    for (const projectId in this.statusSubscriptions) {
      if (this.statusSubscriptions[projectId]) {
        this.statusSubscriptions[projectId].unsubscribe();
      }
    }
    this.projectsSubscription?.unsubscribe();
    this.reviewsSubscription?.unsubscribe();
  }

  projectsMap: { [id: number]: Project } = {}; // Map projects by ID

  loadProjects(): void {
    this.projectsSubscription = this.projectService
      .getProjects()
      .subscribe((projects) => {
        this.projectsMap = projects.reduce((acc, project) => {
          acc[project.id] = project;
          return acc;
        }, {} as { [id: number]: Project });
      });
  }

  loadRecentPredictions() {
    this.loading = true;
    this.error = null;
    this.reviewsSubscription = this.predictionReviewService
      .getPredictionReviews()
      .subscribe({
        next: (reviews) => {
          this.predictionReviews = reviews;
          // Group predictions from all reviews by project name for display
          this.groupedPredictions = reviews.reduce((acc, review) => {
            if (!acc[review.projectName]) {
              acc[review.projectName] = [];
            }
            acc[review.projectName].push(...review.predictions);
            // Start checking report status for each project
            this.checkProjectReportStatus(review.projectId);
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

  checkProjectReportStatus(projectId: number): void {
    console.log(`Checking report status for project ID: ${projectId}`); // Log when checking status
    // Initialize status if not already present
    if (!this.projectReportStatus[projectId]) {
      this.projectReportStatus[projectId] = 'pending';
    }

    // Subscribe to status updates, polling every 5 seconds
    this.statusSubscriptions[projectId] = interval(5000)
      .pipe(
        startWith(0), // Check immediately on init
        switchMap(() => {
          console.log(`Polling report status for project ID: ${projectId}`); // Log when polling
          return this.reportService.getProjectReportsStatus(projectId).pipe(
            catchError((error) => {
              console.error(
                `Error checking report status for project ${projectId}:`,
                error
              );
              // If there's an error (e.g., 404 if report not generated), treat as pending
              return of({ status: 'pending' });
            })
          );
        })
      )
      .subscribe((response) => {
        console.log(
          `Received status for project ID ${projectId}:`,
          response.status
        ); // Log received status
        this.projectReportStatus[projectId] = response.status as
          | 'pending'
          | 'generating'
          | 'completed'
          | 'failed';
        console.log(
          `Updated projectReportStatus for ${projectId}:`,
          this.projectReportStatus[projectId]
        ); // Log updated status
        // If completed or failed, unsubscribe from polling for this project
        if (
          this.projectReportStatus[projectId] === 'completed' ||
          this.projectReportStatus[projectId] === 'failed'
        ) {
          if (this.statusSubscriptions[projectId]) {
            this.statusSubscriptions[projectId].unsubscribe();
            console.log(
              `Unsubscribed from status polling for project ID: ${projectId}`
            ); // Log unsubscribe
          }
        }
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

  viewProjectReport(projectId: number) {
    this.router.navigate(['/reports/project', projectId]); // Navigate to the project reports detail route
  }
}
