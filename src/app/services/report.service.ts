import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  getOverallReport(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/overall`);
  }

  getProjectReport(projectId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/project/${projectId}`);
  }

  generateProjectReports(projectId: string): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(
      `${this.apiUrl}/generate/projects/${projectId}`,
      {}
    );
  }

  getProjectReportsStatus(projectId: string): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(
      `${this.apiUrl}/project/${projectId}`
    );
  }

  // The getter methods will now call the new endpoints and extract data
  getOverallProjectCompletionRate(): Observable<number> {
    return this.getOverallReport().pipe(
      map((report: any) => report?.completion_rate)
    );
  }

  getOverallProjectStatusDistribution(): Observable<{
    [status: string]: number;
  }> {
    return this.getOverallReport().pipe(
      map((report: any) => report?.status_distribution)
    );
  }

  getPredictionsCountForProject(projectId: string): Observable<number> {
    return this.getProjectReport(projectId).pipe(
      map((report: any) => report?.predictions_count)
    );
  }

  getPredictionTypeDistributionForProject(
    projectId: string
  ): Observable<{ [type: string]: number }> {
    return this.getProjectReport(projectId).pipe(
      map((report: any) => report?.prediction_type_distribution)
    );
  }

  // TODO: Add methods for other reports
}
