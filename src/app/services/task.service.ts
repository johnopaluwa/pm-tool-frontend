import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';

// Define Task interface for frontend use, matching backend structure
export interface Task {
  id?: string;
  project_id: string;
  title: string;
  description?: string;
  status_id?: string | null; // Allow null for initial creation
  created_at?: string;
  updated_at?: string;
  // Include status details if joined in backend
  status?: {
    id: string;
    name: string;
    order: number;
    is_default: boolean;
    is_completion_status: boolean;
    stage_id: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks'; // Assuming backend runs on port 3000

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  createTask(task: Task): Observable<Task> {
    this.loadingService.show();
    return this.http
      .post<Task>(this.apiUrl, task)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  getTasksByProjectId(projectId: string): Observable<Task[]> {
    this.loadingService.show();
    return this.http
      .get<Task[]>(`${this.apiUrl}/project/${projectId}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  findOne(id: string): Observable<Task> {
    this.loadingService.show();
    return this.http
      .get<Task>(`${this.apiUrl}/${id}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  update(id: string, task: Partial<Task>): Observable<Task> {
    this.loadingService.show();
    return this.http
      .put<Task>(`${this.apiUrl}/${id}`, task)
      .pipe(finalize(() => this.loadingService.hide()));
  }

  delete(id: string): Observable<any> {
    this.loadingService.show();
    return this.http
      .delete<any>(`${this.apiUrl}/${id}`)
      .pipe(finalize(() => this.loadingService.hide()));
  }
}
