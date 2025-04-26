import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';

export interface Project {
  id: number;
  name: string;
  client: string;
  status: string;
  description: string;
  projectType: string;
  clientIndustry: string;
  techStack: string[];
  teamSize: string;
  duration: string;
  keywords: string;
  businessSpecification: string;
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
}
