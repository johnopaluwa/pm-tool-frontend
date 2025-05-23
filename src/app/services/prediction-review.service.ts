import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators'; // Import catchError and tap
import { LoadingService } from './loading.service';
import { Prediction } from './prediction.service'; // Assuming Prediction interface is here or in a shared model file
import { SnackbarService } from './snackbar.service'; // Import SnackbarService

export interface PredictionReview {
  id: string;
  projectId: string; // Link to the project
  projectName: string;
  clientName?: string;
  generatedAt: string; // Store as ISO string
  predictions: Prediction[];
}

@Injectable({
  providedIn: 'root',
})
export class PredictionReviewService {
  private apiUrl = 'http://localhost:3000/prediction-reviews'; // Assuming backend runs on port 3000

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private snackbarService: SnackbarService // Inject SnackbarService
  ) {}

  addPredictionReview(
    review: Omit<PredictionReview, 'id' | 'generatedAt'>
  ): Observable<PredictionReview> {
    return this.http.post<PredictionReview>(this.apiUrl, review).pipe(
      tap(() => {}), // No specific success action needed for tap here
      catchError((error) => {
        this.snackbarService.showError('Failed to add prediction review.');
        console.error('Error adding prediction review:', error);
        return throwError(() => new Error('Failed to add prediction review.'));
      }),
      finalize(() => {
        // Keep finalize but do nothing
      })
    );
  }

  getPredictionReviews(): Observable<PredictionReview[]> {
    this.loadingService.show();
    return this.http.get<PredictionReview[]>(this.apiUrl).pipe(
      tap(() => this.loadingService.hide()), // Hide loading on success
      catchError((error) => {
        this.loadingService.hide(); // Hide loading on error
        this.snackbarService.showError('Failed to fetch prediction reviews.');
        console.error('Error fetching prediction reviews:', error);
        return throwError(
          () => new Error('Failed to fetch prediction reviews.')
        );
      }),
      finalize(() => {
        // This will run after tap or catchError, ensuring loading is hidden
      })
    );
  }

  getPredictionReviewById(
    id: string
  ): Observable<PredictionReview | undefined> {
    this.loadingService.show();
    return this.http
      .get<PredictionReview | undefined>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => this.loadingService.hide()), // Hide loading on success
        catchError((error) => {
          this.loadingService.hide(); // Hide loading on error
          this.snackbarService.showError(
            `Failed to fetch prediction review with ID ${id}.`
          );
          console.error(
            `Error fetching prediction review with ID ${id}:`,
            error
          );
          return throwError(
            () => new Error(`Failed to fetch prediction review with ID ${id}.`)
          );
        }),
        finalize(() => {
          // This will run after tap or catchError, ensuring loading is hidden
        })
      );
  }

  getPredictionReviewsByProjectId(
    projectId: string
  ): Observable<PredictionReview[]> {
    this.loadingService.show();
    return this.http
      .get<PredictionReview[]>(`${this.apiUrl}/project/${projectId}`)
      .pipe(
        tap(() => this.loadingService.hide()), // Hide loading on success
        catchError((error) => {
          this.loadingService.hide(); // Hide loading on error
          this.snackbarService.showError(
            `Failed to fetch prediction reviews for project with ID ${projectId}.`
          );
          console.error(
            `Error fetching prediction reviews for project with ID ${projectId}:`,
            error
          );
          return throwError(
            () =>
              new Error(
                `Failed to fetch prediction reviews for project with ID ${projectId}.`
              )
          );
        }),
        finalize(() => {
          // This will run after tap or catchError, ensuring loading is hidden
        })
      );
  }
}
