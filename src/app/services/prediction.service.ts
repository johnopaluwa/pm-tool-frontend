import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators'; // Import catchError and tap
import { LoadingService } from './loading.service';
import { PredictionReview } from './prediction-review.service'; // Import PredictionReview
import { SnackbarService } from './snackbar.service'; // Import SnackbarService

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
    private loadingService: LoadingService,
    private snackbarService: SnackbarService // Inject SnackbarService
  ) {}

  generatePredictions(
    projectData: any,
    projectId: string
  ): Observable<Prediction[]> {
    return this.http
      .post<Prediction[]>(`${this.apiUrl}/generate/${projectId}`, projectData)
      .pipe(
        tap(() => {}), // No specific success action needed for tap here
        catchError((error) => {
          this.snackbarService.showError(
            `Failed to generate predictions for project with ID ${projectId}.`
          );
          console.error(
            `Error generating predictions for project with ID ${projectId}:`,
            error
          );
          return throwError(
            () =>
              new Error(
                `Failed to generate predictions for project with ID ${projectId}.`
              )
          );
        }),
        finalize(() => {
          // Keep finalize but do nothing
        })
      );
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
        tap(() => {
          //  this.loadingService.hide()
        }), // No specific success action needed for tap here
        catchError((error) => {
          //  this.loadingService.hide(); // Hide loading spinner on error
          this.snackbarService.showError(
            `Failed to generate and save prediction review for project with ID ${projectId}.`
          );
          console.error(
            `Error generating and saving prediction review for project with ID ${projectId}:`,
            error
          );
          return throwError(
            () =>
              new Error(
                `Failed to generate and save prediction review for project with ID ${projectId}.`
              )
          );
        }),
        finalize(() => {
          //  this.loadingService.hide()
        })
      ); // Hide loading spinner on completion
  }

  sendFeedback(feedbackData: any): Observable<any> {
    this.loadingService.show();
    return this.http.post<any>(`${this.apiUrl}/feedback`, feedbackData).pipe(
      tap(() => this.loadingService.hide()), // Hide loading on success
      catchError((error) => {
        this.loadingService.hide(); // Hide loading on error
        this.snackbarService.showError('Failed to send feedback.');
        console.error('Error sending feedback:', error);
        return throwError(() => new Error('Failed to send feedback.'));
      }),
      finalize(() => {
        // This will run after tap or catchError, ensuring loading is hidden
      })
    );
  }

  getPredictionHistory(projectId: string): Observable<Prediction[]> {
    this.loadingService.show();
    return this.http
      .get<Prediction[]>(`${this.apiUrl}/history/${projectId}`)
      .pipe(
        tap(() => this.loadingService.hide()), // Hide loading on success
        catchError((error) => {
          this.loadingService.hide(); // Hide loading on error
          this.snackbarService.showError(
            `Failed to fetch prediction history for project with ID ${projectId}.`
          );
          console.error(
            `Error fetching prediction history for project with ID ${projectId}:`,
            error
          );
          return throwError(
            () =>
              new Error(
                `Failed to fetch prediction history for project with ID ${projectId}.`
              )
          );
        }),
        finalize(() => {
          // This will run after tap or catchError, ensuring loading is hidden
        })
      );
  }
}
