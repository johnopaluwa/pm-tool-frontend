import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MockDataService } from './mock-data.service'; // Import MockDataService
import { Prediction } from './prediction.service'; // Assuming Prediction interface is here or in a shared model file

export interface PredictionReview {
  id: string;
  projectId: number; // Link to the project
  projectName: string;
  clientName?: string;
  generatedAt: Date;
  predictions: Prediction[];
}

@Injectable({
  providedIn: 'root',
})
export class MockPredictionReviewService {
  private mockPredictionReviews: PredictionReview[] = [
    {
      id: 'review-1',
      projectId: 1,
      projectName: 'Project Alpha',
      clientName: 'Client A',
      generatedAt: new Date('2023-10-26T10:00:00Z'),
      predictions: [
        {
          id: 'us-1',
          type: 'userStory',
          title: 'As a user, I want to reset my password',
          description: 'Allow users to reset their password via email link.',
          similarityScore: 85,
          frequency: 90,
          sourceProject: 'Project Alpha',
          status: 'pending',
        },
        {
          id: 'bug-2',
          type: 'bug',
          title: 'Cross-browser compatibility issues',
          description: 'Fix layout issues in Safari and IE11.',
          similarityScore: 70,
          frequency: 55,
          sourceProject: 'Project Alpha',
          status: 'pending',
        },
      ],
    },
    {
      id: 'review-2',
      projectId: 2,
      projectName: 'Project Beta',
      clientName: 'Client B',
      generatedAt: new Date('2023-11-15T14:30:00Z'),
      predictions: [
        {
          id: 'us-2',
          type: 'userStory',
          title: 'As an admin, I want to manage users',
          description: 'Admin panel for creating, editing, and deleting users.',
          similarityScore: 80,
          frequency: 75,
          sourceProject: 'Project Beta',
          status: 'pending',
        },
      ],
    },
  ];

  constructor(private mockDataService: MockDataService) {
    // Inject MockDataService
    // Ensure initial reviews have correct project names/clients from MockDataService if needed,
    // although hardcoding them here is simpler for mock data.
  }

  addPredictionReview(
    review: Omit<PredictionReview, 'id' | 'generatedAt'>
  ): Observable<PredictionReview> {
    const newId = `review-${this.mockPredictionReviews.length + 1}`; // Simple ID generation
    const newReview: PredictionReview = {
      ...review,
      id: newId,
      generatedAt: new Date(),
    };
    this.mockPredictionReviews.push(newReview);
    console.log('New prediction review added:', newReview);
    console.log('All prediction reviews:', this.mockPredictionReviews);
    return of(newReview);
  }

  getPredictionReviews(): Observable<PredictionReview[]> {
    return of(this.mockPredictionReviews);
  }

  getPredictionReviewById(
    id: string
  ): Observable<PredictionReview | undefined> {
    return of(this.mockPredictionReviews.find((review) => review.id === id));
  }

  getPredictionReviewsByProjectId(
    projectId: number
  ): Observable<PredictionReview[]> {
    return of(
      this.mockPredictionReviews.filter(
        (review) => review.projectId === projectId
      )
    );
  }
}
