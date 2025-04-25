import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  addProject(project: any): Observable<number> {
    // The backend expects projectName and clientName, which are already in the project object
    return this.http.post<number>(this.apiUrl, project);
  }
}
