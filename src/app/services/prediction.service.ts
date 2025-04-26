import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';

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

@Injectable({
  providedIn: 'root',
})
export class PredictionService {
  private apiUrl = 'http://localhost:3000/predictions'; // Assuming backend runs on port 3000

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  generatePredictions(projectData: any): Observable<Prediction[]> {
    return this.http
      .post<Prediction[]>(`${this.apiUrl}/generate`, projectData)
      .pipe(finalize(() => {})); // Keep finalize but do nothing
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
