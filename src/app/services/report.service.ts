import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators'; // Import catchError and tap
import { SnackbarService } from './snackbar.service'; // Import SnackbarService

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = 'http://localhost:3000/reports'; // Assuming backend runs on port 3000

  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService
  ) {}

  generateOverallReports(): Observable<{ status: string }> {
    return this.http
      .post<{ status: string }>(`${this.apiUrl}/generate/overall`, {})
      .pipe(
        tap(() => {}), // No specific success action needed for tap here
        catchError((error) => {
          this.snackbarService.showError('Failed to generate overall reports.');
          console.error('Error generating overall reports:', error);
          return throwError(
            () => new Error('Failed to generate overall reports.')
          );
        })
      );
  }

  getOverallReportsStatus(): Observable<{ status: string }> {
    return this.http
      .get<{ status: string }>(`${this.apiUrl}/status/overall`)
      .pipe(
        tap(() => {}), // No specific success action needed for tap here
        catchError((error) => {
          this.snackbarService.showError(
            'Failed to fetch overall reports status.'
          );
          console.error('Error fetching overall reports status:', error);
          return throwError(
            () => new Error('Failed to fetch overall reports status.')
          );
        })
      );
  }

  getOverallReport(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/overall`).pipe(
      tap(() => {}), // No specific success action needed for tap here
      catchError((error) => {
        this.snackbarService.showError('Failed to fetch overall report.');
        console.error('Error fetching overall report:', error);
        return throwError(() => new Error('Failed to fetch overall report.'));
      })
    );
  }

  getProjectReport(projectId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/project/${projectId}`).pipe(
      tap(() => {}), // No specific success action needed for tap here
      catchError((error) => {
        this.snackbarService.showError(
          `Failed to fetch project report for project with ID ${projectId}.`
        );
        console.error(
          `Error fetching project report for project with ID ${projectId}:`,
          error
        );
        return throwError(
          () =>
            new Error(
              `Failed to fetch project report for project with ID ${projectId}.`
            )
        );
      })
    );
  }

  generateProjectReports(projectId: string): Observable<{ status: string }> {
    return this.http
      .post<{ status: string }>(
        `${this.apiUrl}/generate/projects/${projectId}`,
        {}
      )
      .pipe(
        tap(() => {}), // No specific success action needed for tap here
        catchError((error) => {
          this.snackbarService.showError(
            `Failed to generate project reports for project with ID ${projectId}.`
          );
          console.error(
            `Error generating project reports for project with ID ${projectId}:`,
            error
          );
          return throwError(
            () =>
              new Error(
                `Failed to generate project reports for project with ID ${projectId}.`
              )
          );
        })
      );
  }

  getProjectReportsStatus(projectId: string): Observable<{ status: string }> {
    return this.http
      .get<{ status: string }>(`${this.apiUrl}/project/${projectId}`)
      .pipe(
        tap(() => {}), // No specific success action needed for tap here
        catchError((error) => {
          this.snackbarService.showError(
            `Failed to fetch project reports status for project with ID ${projectId}.`
          );
          console.error(
            `Error fetching project reports status for project with ID ${projectId}:`,
            error
          );
          return throwError(
            () =>
              new Error(
                `Failed to fetch project reports status for project with ID ${projectId}.`
              )
          );
        })
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
