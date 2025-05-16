import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators'; // Import map
import { LoadingService } from './loading.service';

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
    private loadingService: LoadingService
  ) {}

  getProjects(): Observable<Project[]> {
    this.loadingService.show();
    return this.http
      .get<Project[]>(this.apiUrl)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  getProjectById(id: string): Observable<Project> {
    this.loadingService.show();
    return this.http
      .get<Project>(`${this.apiUrl}/${id}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  addProject(project: any): Observable<string> {
    // The backend expects projectName and clientName, which are already in the project object
    this.loadingService.show();
    return this.http.post<{ id: string }>(this.apiUrl, project).pipe(
      map((response) => response.id), // Extract the id from the response object
      finalize(() => this.loadingService.hide())
    );
  }

  updateProject(id: string, project: Partial<Project>): Observable<Project> {
    this.loadingService.show();
    return this.http
      .put<Project>(`${this.apiUrl}/${id}`, project)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  updateProjectStatus(
    id: string,
    status: string // Changed type to string
  ): Observable<Project> {
    // No loading spinner for status updates as per user feedback
    return this.http.patch<Project>(`${this.apiUrl}/${id}/status`, { status });
  }

  markReportGenerated(projectId: string): Observable<Project> {
    // No loading spinner for this action
    return this.http.patch<Project>(
      `${this.apiUrl}/${projectId}/mark-report-generated`,
      {}
    );
  }
}
