import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router'; // Import RouterModule
import { Subscription } from 'rxjs';
import {
  PredictionReview,
  PredictionReviewService,
} from '../../services/prediction-review.service'; // Import PredictionReviewService
import { PredictionService } from '../../services/prediction.service'; // Import PredictionService and Prediction
import { Project, ProjectService } from '../../services/project.service'; // Import ProjectService and Project interface

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule], // Import RouterModule
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
})
export class ProjectDetailComponent implements OnDestroy {
  project: Project | undefined; // Define Project interface
  predictionReviews: PredictionReview[] = []; // Property to store prediction reviews for this project
  private projectSubscription: Subscription | undefined;
  private reviewsSubscription: Subscription | undefined;
  private generatePredictionsSubscription: Subscription | undefined;
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
      this.projectSubscription = this.projectService
        .getProjectById(id)
        .subscribe((project) => {
          this.project = project;
        });

      // Fetch prediction reviews for this project
      this.reviewsSubscription = this.predictionReviewService
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

    // Use project data to generate and save predictions and review
    this.generatePredictionsSubscription = this.predictionService
      .generateAndSavePredictionReview(this.project, this.project.id) // Use the new combined method
      .subscribe({
        next: (addedReview: PredictionReview) => {
          this.generatingPredictions = false;
          // Add the new review to the local array to update the display
          this.predictionReviews.push(addedReview);
          console.log(
            'Prediction review and predictions generated and saved successfully:',
            addedReview
          );
        },
        error: (err: any) => {
          this.generatingPredictions = false;
          this.predictionError =
            'Failed to generate and save prediction review. Please try again.';
          console.error(err);
        },
      });
  }
  ngOnDestroy(): void {
    this.projectSubscription?.unsubscribe();
    this.reviewsSubscription?.unsubscribe();
    this.generatePredictionsSubscription?.unsubscribe();
  }
}
