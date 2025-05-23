import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators'; // Import catchError and tap
import { LoadingService } from './loading.service';
import { SnackbarService } from './snackbar.service'; // Import SnackbarService

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
    private loadingService: LoadingService,
    private snackbarService: SnackbarService // Inject SnackbarService
  ) {}

  createTask(task: Task): Observable<Task> {
    this.loadingService.show();
    return this.http.post<Task>(this.apiUrl, task).pipe(
      tap(() => this.loadingService.hide()), // Hide loading on success
      catchError((error) => {
        this.loadingService.hide(); // Hide loading on error
        this.snackbarService.showError('Failed to create task.');
        console.error('Error creating task:', error);
        return throwError(() => new Error('Failed to create task.'));
      }),
      finalize(() => {
        // This will run after tap or catchError, ensuring loading is hidden
      })
    );
  }

  getTasksByProjectId(projectId: string): Observable<Task[]> {
    this.loadingService.show();
    return this.http.get<Task[]>(`${this.apiUrl}/project/${projectId}`).pipe(
      tap(() => this.loadingService.hide()), // Hide loading on success
      catchError((error) => {
        this.loadingService.hide(); // Hide loading on error
        this.snackbarService.showError(
          `Failed to fetch tasks for project with ID ${projectId}.`
        );
        console.error(
          `Error fetching tasks for project with ID ${projectId}:`,
          error
        );
        return throwError(
          () =>
            new Error(`Failed to fetch tasks for project with ID ${projectId}.`)
        );
      }),
      finalize(() => {
        // This will run after tap or catchError, ensuring loading is hidden
      })
    );
  }

  findOne(id: string): Observable<Task> {
    this.loadingService.show();
    return this.http.get<Task>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadingService.hide()), // Hide loading on success
      catchError((error) => {
        this.loadingService.hide(); // Hide loading on error
        this.snackbarService.showError(`Failed to fetch task with ID ${id}.`);
        console.error(`Error fetching task with ID ${id}:`, error);
        return throwError(
          () => new Error(`Failed to fetch task with ID ${id}.`)
        );
      }),
      finalize(() => {
        // This will run after tap or catchError, ensuring loading is hidden
      })
    );
  }

  update(id: string, task: Partial<Task>): Observable<Task> {
    this.loadingService.show();
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task).pipe(
      tap(() => this.loadingService.hide()), // Hide loading on success
      catchError((error) => {
        this.loadingService.hide(); // Hide loading on error
        this.snackbarService.showError(`Failed to update task with ID ${id}.`);
        console.error(`Error updating task with ID ${id}:`, error);
        return throwError(
          () => new Error(`Failed to update task with ID ${id}.`)
        );
      }),
      finalize(() => {
        // This will run after tap or catchError, ensuring loading is hidden
      })
    );
  }

  delete(id: string): Observable<any> {
    this.loadingService.show();
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadingService.hide()), // Hide loading on success
      catchError((error) => {
        this.loadingService.hide(); // Hide loading on error
        this.snackbarService.showError(`Failed to delete task with ID ${id}.`);
        console.error(`Error deleting task with ID ${id}:`, error);
        return throwError(
          () => new Error(`Failed to delete task with ID ${id}.`)
        );
      }),
      finalize(() => {
        // This will run after tap or catchError, ensuring loading is hidden
      })
    );
  }
}
