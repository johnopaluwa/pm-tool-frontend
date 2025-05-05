import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';
import { PredictionReview } from './prediction-review.service'; // Import PredictionReview

export interface Prediction {
  id: string;
  aiGeneratedId: string; // Added to match backend model
  type: 'user-story' | 'bug'; // Updated type to match backend
  title: string;
  description: string;
  similarityScore: number;
  frequency: number;
  sourceProject: string;
  status?: 'pending' | 'accepted' | 'rejected' | 'edited';

  // Added fields for User Stories (optional)
  acceptanceCriteria: string[];
  dependencies: string[];
  assumptions: string[];
  edgeCases: string[];
  nonFunctionalRequirements: string;
  visuals: string[];
  dataRequirements: string;
  impact: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';

  // Added fields for Bug Details (optional)
  stepsToReproduce: string[];
  actualResult: string;
  expectedResult: string;
  environment: string;
  userAccountDetails: string;
  screenshotsVideos: string[];
  errorMessagesLogs: string;
  frequencyOfOccurrence: 'Consistent' | 'Intermittent' | 'Rare';
  severity: 'Cosmetic' | 'Minor' | 'Major' | 'Blocking';
  workaround: string;
  relatedIssues: string[];

  // Added field for Estimated Time
  estimatedTime: number; // Estimated time in hours
  isCollapsed?: boolean; // Added for UI collapsibility
}

@Injectable({
  providedIn: 'root',
})
export class PredictionService {
  private apiUrl = 'http://localhost:3000/predictions'; // Assuming backend runs on port 3000

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  generatePredictions(
    projectData: any,
    projectId: string
  ): Observable<Prediction[]> {
    return this.http
      .post<Prediction[]>(`${this.apiUrl}/generate/${projectId}`, projectData)
      .pipe(finalize(() => {})); // Keep finalize but do nothing
  }

  generateAndSavePredictionReview(
    projectData: any,
    projectId: string
  ): Observable<PredictionReview> {
    // this.loadingService.show(); // Show loading spinner
    return this.http
      .post<PredictionReview>(
        `${this.apiUrl}/generate-and-review/${projectId}`,
        projectData
      )
      .pipe(
        finalize(() => {
          //  this.loadingService.hide()
        })
      ); // Hide loading spinner on completion
  }

  sendFeedback(feedbackData: any): Observable<any> {
    this.loadingService.show();
    return this.http
      .post<any>(`${this.apiUrl}/feedback`, feedbackData)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  getPredictionHistory(projectId: string): Observable<Prediction[]> {
    this.loadingService.show();
    return this.http
      .get<Prediction[]>(`${this.apiUrl}/history/${projectId}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }
}
