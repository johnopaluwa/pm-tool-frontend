import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = 'http://localhost:3000/reports'; // Assuming backend runs on port 3000

  constructor(private http: HttpClient) {}

  generateOverallReports(): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(
      `${this.apiUrl}/generate/overall`,
      {}
    );
  }

  getOverallReportsStatus(): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(`${this.apiUrl}/status/overall`);
  }

  getOverallProjectCompletionRate(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/overall/completion-rate`);
  }

  getOverallProjectStatusDistribution(): Observable<{
    [status: string]: number;
  }> {
    return this.http.get<{ [status: string]: number }>(
      `${this.apiUrl}/overall/status-distribution`
    );
  }

  generateProjectReports(projectId: number): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(
      `${this.apiUrl}/generate/projects/${projectId}`,
      {}
    );
  }

  getProjectReportsStatus(projectId: number): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(
      `${this.apiUrl}/status/projects/${projectId}`
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
