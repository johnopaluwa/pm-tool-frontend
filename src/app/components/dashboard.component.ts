import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  PredictionReview,
  PredictionReviewService,
} from '../services/prediction-review.service'; // Import PredictionReviewService
import { Project, ProjectService } from '../services/project.service'; // Import ProjectService and Project interface

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  projects: Project[] = []; // Use Project interface
  recentReviews: PredictionReview[] = []; // Property to store recent reviews
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
        this.projects = projects;
      });

    // Fetch recent prediction reviews
    this.predictionReviewService
      .getPredictionReviews()
      .subscribe((reviews: PredictionReview[]) => {
        // For dashboard, maybe show a limited number of recent reviews
        this.recentReviews = reviews.slice(-5); // Get the last 5 reviews
      });
  }

  ngOnDestroy(): void {
    this.projectsSubscription?.unsubscribe();
    this.reviewsSubscription?.unsubscribe();
  }
}
