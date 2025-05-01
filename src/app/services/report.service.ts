import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = 'http://localhost:3000/reports'; // Assuming backend runs on port 3000

  constructor(private http: HttpClient) {}

  getOverallProjectCompletionRate(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/completion-rate`);
  }

  getOverallProjectStatusDistribution(): Observable<{
    [status: string]: number;
  }> {
    return this.http.get<{ [status: string]: number }>(
      `${this.apiUrl}/status-distribution`
    );
  }

  getPredictionsCountForProject(projectId: number): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/projects/${projectId}/predictions-count`
    );
  }

  getPredictionTypeDistributionForProject(
    projectId: number
  ): Observable<{ [type: string]: number }> {
    return this.http.get<{ [type: string]: number }>(
      `${this.apiUrl}/projects/${projectId}/prediction-type-distribution`
    );
  }

  // TODO: Add methods for other reports
}
