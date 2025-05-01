import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';

export interface Project {
  id: number;
  name: string;
  client: string;
  status: 'new' | 'predicting' | 'completed';
  description: string;
  projectType: string;
  clientIndustry: string;
  techStack: string[];
  teamSize: string;
  duration: string;
  keywords: string;
  businessSpecification: string;
  reportGenerated?: boolean; // Add reportGenerated flag
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

  getProjectById(id: number): Observable<Project> {
    this.loadingService.show();
    return this.http
      .get<Project>(`${this.apiUrl}/${id}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  addProject(project: any): Observable<number> {
    // The backend expects projectName and clientName, which are already in the project object
    this.loadingService.show();
    return this.http
      .post<number>(this.apiUrl, project)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  updateProjectStatus(
    id: number,
    status: 'new' | 'predicting' | 'completed'
  ): Observable<Project> {
    // No loading spinner for status updates as per user feedback
    return this.http.patch<Project>(`${this.apiUrl}/${id}/status`, { status });
  }

  markReportGenerated(projectId: number): Observable<Project> {
    // No loading spinner for this action
    return this.http.patch<Project>(
      `${this.apiUrl}/${projectId}/mark-report-generated`,
      {}
    );
  }
}
