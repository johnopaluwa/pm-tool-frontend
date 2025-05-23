import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  PredictionReview,
  PredictionReviewService,
} from '../services/prediction-review.service'; // Import PredictionReviewService
import { Project, ProjectService } from '../services/project.service'; // Import ProjectService and Project interface

// Define a new interface that extends PredictionReview and adds the status property
interface PredictionReviewWithStatus extends PredictionReview {
  status: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  projects: Project[] = []; // Use Project interface
  recentReviews: PredictionReviewWithStatus[] = []; // Use the new interface
  private projectsSubscription: Subscription | undefined;
  private reviewsSubscription: Subscription | undefined;

  constructor(
    private projectService: ProjectService, // Inject ProjectService
    private predictionReviewService: PredictionReviewService
  ) {} // Inject PredictionReviewService

  ngOnInit(): void {
    // Fetch projects
    this.projectsSubscription = this.projectService
      .getProjects()
      .subscribe((projects: Project[]) => {
        this.projects = projects.slice(-6); // Limit to the latest 6 projects
      });

    // Fetch recent prediction reviews
    this.predictionReviewService
      .getPredictionReviews()
      .subscribe((reviews: PredictionReview[]) => {
        // For dashboard, maybe show a limited number of recent reviews
        this.recentReviews = reviews.slice(-6).map((review) => {
          // Limit to the latest 6 reviews
          const project = this.projects.find((p) => p.id === review.projectId);
          return {
            ...review,
            status: project ? project.status : 'Unknown', // Add project status to review object
          };
        });
      });
  }

  ngOnDestroy(): void {
    this.projectsSubscription?.unsubscribe();
    this.reviewsSubscription?.unsubscribe();
  }
}
