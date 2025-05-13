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

  getOverallProjectTypeDistribution(): Observable<{ [type: string]: number }> {
    return this.getOverallReport().pipe(
      map((report: any) => report?.project_type_distribution)
    );
  }

  getOverallClientIndustryDistribution(): Observable<{
    [industry: string]: number;
  }> {
    return this.getOverallReport().pipe(
      map((report: any) => report?.client_industry_distribution)
    );
  }

  getOverallTeamSizeDistribution(): Observable<{ [size: string]: number }> {
    return this.getOverallReport().pipe(
      map((report: any) => report?.team_size_distribution)
    );
  }

  getOverallDurationDistribution(): Observable<{ [duration: string]: number }> {
    return this.getOverallReport().pipe(
      map((report: any) => report?.duration_distribution)
    );
  }

  getOverallTotalPredictionsCount(): Observable<number> {
    return this.getOverallReport().pipe(
      map((report: any) => report?.total_predictions_count)
    );
  }

  getOverallAveragePredictionsPerProject(): Observable<number> {
    return this.getOverallReport().pipe(
      map((report: any) => report?.average_predictions_per_project)
    );
  }

  getProjectPredictionStatusDistribution(
    projectId: string
  ): Observable<{ [status: string]: number }> {
    return this.getProjectReport(projectId).pipe(
      map((report: any) => report?.prediction_status_distribution)
    );
  }

  getProjectPredictionPriorityDistribution(
    projectId: string
  ): Observable<{ [priority: string]: number }> {
    return this.getProjectReport(projectId).pipe(
      map((report: any) => report?.prediction_priority_distribution)
    );
  }

  getProjectPredictionSeverityDistribution(
    projectId: string
  ): Observable<{ [severity: string]: number }> {
    return this.getProjectReport(projectId).pipe(
      map((report: any) => report?.prediction_severity_distribution)
    );
  }

  getProjectAverageEstimatedTime(projectId: string): Observable<number> {
    return this.getProjectReport(projectId).pipe(
      map((report: any) => report?.average_estimated_time)
    );
  }

  getProjectTopKeywords(projectId: string): Observable<string[]> {
    return this.getProjectReport(projectId).pipe(
      map((report: any) => report?.top_keywords)
    );
  }

  getProjectTechStackList(projectId: string): Observable<string[]> {
    return this.getProjectReport(projectId).pipe(
      map((report: any) => report?.tech_stack_list)
    );
  }
}
