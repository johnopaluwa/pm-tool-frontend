import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../services/mock-data.service';
import {
  MockPredictionReviewService,
  PredictionReview,
} from '../services/mock-prediction-review.service'; // Import MockPredictionReviewService

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  projects: any[] = []; // Or define a Project interface
  recentReviews: PredictionReview[] = []; // Property to store recent reviews

  constructor(
    private mockDataService: MockDataService,
    private mockPredictionReviewService: MockPredictionReviewService
  ) {} // Inject MockPredictionReviewService

  ngOnInit(): void {
    this.projects = this.mockDataService.mockProjects; // Assuming mockProjects is public or add a getProjects method

    // Fetch recent prediction reviews
    this.mockPredictionReviewService
      .getPredictionReviews()
      .subscribe((reviews) => {
        // For dashboard, maybe show a limited number of recent reviews
        this.recentReviews = reviews.slice(-5); // Get the last 5 reviews
      });
  }
}
