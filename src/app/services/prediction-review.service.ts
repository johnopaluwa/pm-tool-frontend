import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';
import { Prediction } from './prediction.service'; // Assuming Prediction interface is here or in a shared model file

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
    private loadingService: LoadingService
  ) {}

  addPredictionReview(
    review: Omit<PredictionReview, 'id' | 'generatedAt'>
  ): Observable<PredictionReview> {
    return this.http
      .post<PredictionReview>(this.apiUrl, review)
      .pipe(finalize(() => {})); // Keep finalize but do nothing
  }

  getPredictionReviews(): Observable<PredictionReview[]> {
    this.loadingService.show();
    return this.http
      .get<PredictionReview[]>(this.apiUrl)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  getPredictionReviewById(
    id: string
  ): Observable<PredictionReview | undefined> {
    this.loadingService.show();
    return this.http
      .get<PredictionReview | undefined>(`${this.apiUrl}/${id}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  getPredictionReviewsByProjectId(
    projectId: string
  ): Observable<PredictionReview[]> {
    this.loadingService.show();
    return this.http
      .get<PredictionReview[]>(`${this.apiUrl}/project/${projectId}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }
}
