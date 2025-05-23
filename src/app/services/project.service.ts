import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators'; // Import map, catchError, tap
import { LoadingService } from './loading.service';
import { SnackbarService } from './snackbar.service';

export interface Project {
  id: string;
  name: string;
  client: string;
  status: string; // Changed type to string to accommodate workflow statuses
  description: string;
  projectType: string;
  clientIndustry: string;
  techStack: string[];
  teamSize: string;
  duration: string;
  keywords: string;
  businessSpecification: string;
  reportGenerated?: boolean; // Add reportGenerated flag
  workflow_id?: string | null; // Add optional workflow_id, allow null
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = 'http://localhost:3000/projects'; // Assuming backend runs on port 3000

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private snackbarService: SnackbarService // Inject SnackbarService
  ) {}

  getProjects(): Observable<Project[]> {
    this.loadingService.show();
    return this.http.get<Project[]>(this.apiUrl).pipe(
      tap(() => this.loadingService.hide()), // Hide loading on success
      catchError((error) => {
        this.loadingService.hide(); // Hide loading on error
        this.snackbarService.showError('Failed to fetch projects.'); // Show error snackbar
        console.error('Error fetching projects:', error); // Log the error
        return throwError(() => new Error('Failed to fetch projects.')); // Re-throw the error
      }),
      finalize(() => {
        // This will run after tap or catchError, ensuring loading is hidden
      })
    );
  }

  getProjectById(id: string): Observable<Project> {
    this.loadingService.show();
    return this.http.get<Project>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadingService.hide()), // Hide loading on success
      catchError((error) => {
        this.loadingService.hide(); // Hide loading on error
        this.snackbarService.showError(
          `Failed to fetch project with ID ${id}.`
        ); // Show error snackbar
        console.error(`Error fetching project with ID ${id}:`, error); // Log the error
        return throwError(
          () => new Error(`Failed to fetch project with ID ${id}.`)
        ); // Re-throw the error
      }),
      finalize(() => {
        // This will run after tap or catchError, ensuring loading is hidden
      })
    );
  }

  addProject(project: any): Observable<string> {
    // The backend expects projectName and clientName, which are already in the project object
    this.loadingService.show();
    return this.http.post<{ id: string }>(this.apiUrl, project).pipe(
      map((response) => response.id), // Extract the id from the response object
      tap(() => this.loadingService.hide()), // Hide loading on success
      catchError((error) => {
        this.loadingService.hide(); // Hide loading on error
        this.snackbarService.showError('Failed to add project.'); // Show error snackbar
        console.error('Error adding project:', error); // Log the error
        return throwError(() => new Error('Failed to add project.')); // Re-throw the error
      }),
      finalize(() => {
        // This will run after tap or catchError, ensuring loading is hidden
      })
    );
  }

  updateProject(id: string, project: Partial<Project>): Observable<Project> {
    this.loadingService.show();
    return this.http.put<Project>(`${this.apiUrl}/${id}`, project).pipe(
      tap(() => this.loadingService.hide()), // Hide loading on success
      catchError((error) => {
        this.loadingService.hide(); // Hide loading on error
        this.snackbarService.showError(
          `Failed to update project with ID ${id}.`
        ); // Show error snackbar
        console.error(`Error updating project with ID ${id}:`, error); // Log the error
        return throwError(
          () => new Error(`Failed to update project with ID ${id}.`)
        ); // Re-throw the error
      }),
      finalize(() => {
        // This will run after tap or catchError, ensuring loading is hidden
      })
    );
  }

  updateProjectStatus(
    id: string,
    status: string // Changed type to string
  ): Observable<Project> {
    // No loading spinner for status updates as per user feedback
    return this.http
      .patch<Project>(`${this.apiUrl}/${id}/status`, { status })
      .pipe(
        catchError((error) => {
          this.snackbarService.showError(
            `Failed to update status for project with ID ${id}.`
          ); // Show error snackbar
          console.error(`Error updating project status with ID ${id}:`, error); // Log the error
          return throwError(
            () =>
              new Error(`Failed to update status for project with ID ${id}.`)
          ); // Re-throw the error
        })
      );
  }

  markReportGenerated(projectId: string): Observable<Project> {
    // No loading spinner for this action
    return this.http
      .patch<Project>(`${this.apiUrl}/${projectId}/mark-report-generated`, {})
      .pipe(
        catchError((error) => {
          this.snackbarService.showError(
            `Failed to mark report generated for project with ID ${projectId}.`
          ); // Show error snackbar
          console.error(
            `Error marking report generated for project with ID ${projectId}:`,
            error
          ); // Log the error
          return throwError(
            () =>
              new Error(
                `Failed to mark report generated for project with ID ${projectId}.`
              )
          ); // Re-throw the error
        })
      );
  }
}
