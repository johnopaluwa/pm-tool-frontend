import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Prediction {
  id: string;
  type: 'userStory' | 'bug';
  title: string;
  description: string;
  similarityScore: number;
  frequency: number;
  sourceProject: string;
  status?: 'pending' | 'accepted' | 'rejected' | 'edited';
}

const MOCK_PREDICTIONS: Prediction[] = [
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
    id: 'us-2',
    type: 'userStory',
    title: 'As an admin, I want to manage users',
    description: 'Admin panel for creating, editing, and deleting users.',
    similarityScore: 80,
    frequency: 75,
    sourceProject: 'Project Beta',
    status: 'pending',
  },
  {
    id: 'bug-1',
    type: 'bug',
    title: 'Handling of edge cases in payment API',
    description: 'Ensure payment API handles all error codes gracefully.',
    similarityScore: 75,
    frequency: 60,
    sourceProject: 'Project Gamma',
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
];

@Injectable({
  providedIn: 'root',
})
export class PredictionService {
  // private apiUrl = '/api/predictions';

  constructor() {}

  generatePredictions(projectData: any): Observable<Prediction[]> {
    // Return mock data instead of real API call
    return of(MOCK_PREDICTIONS);
  }

  sendFeedback(feedbackData: any): Observable<any> {
    // No-op for mock
    console.log('Mock feedback sent:', feedbackData);
    return of({ success: true });
  }

  getPredictionHistory(projectId: string): Observable<Prediction[]> {
    // Return a filtered subset of mock data for history
    return of(MOCK_PREDICTIONS.filter((p) => p.sourceProject === projectId));
  }
}
