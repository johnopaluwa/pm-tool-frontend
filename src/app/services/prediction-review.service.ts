import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
export class PredictionReviewService {
  private apiUrl = 'http://localhost:3000/prediction-reviews'; // Assuming backend runs on port 3000

  constructor(private http: HttpClient) {}

  addPredictionReview(
    review: Omit<PredictionReview, 'id' | 'generatedAt'>
  ): Observable<PredictionReview> {
    return this.http.post<PredictionReview>(this.apiUrl, review);
  }

  getPredictionReviews(): Observable<PredictionReview[]> {
    return this.http.get<PredictionReview[]>(this.apiUrl);
  }

  getPredictionReviewById(
    id: string
  ): Observable<PredictionReview | undefined> {
    return this.http.get<PredictionReview | undefined>(`${this.apiUrl}/${id}`);
  }

  getPredictionReviewsByProjectId(
    projectId: number
  ): Observable<PredictionReview[]> {
    return this.http.get<PredictionReview[]>(
      `${this.apiUrl}/project/${projectId}`
    );
  }
}
