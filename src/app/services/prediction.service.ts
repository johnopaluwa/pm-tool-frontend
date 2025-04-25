import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  generatePredictions(projectData: any): Observable<Prediction[]> {
    return this.http.post<Prediction[]>(`${this.apiUrl}/generate`, projectData);
  }

  sendFeedback(feedbackData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/feedback`, feedbackData);
  }

  getPredictionHistory(projectId: string): Observable<Prediction[]> {
    return this.http.get<Prediction[]>(`${this.apiUrl}/history/${projectId}`);
  }
}
