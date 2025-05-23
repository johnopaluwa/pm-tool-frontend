import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'; // Import catchError and tap
import { SnackbarService } from './snackbar.service'; // Import SnackbarService

// Define interfaces for frontend use, matching backend structure
export interface Workflow {
  id?: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WorkflowStage {
  id?: string;
  workflow_id: string;
  name: string;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface StageStatus {
  id?: string;
  stage_id: string;
  name: string;
  order: number;
  is_default?: boolean;
  is_completion_status?: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class WorkflowService {
  private apiUrl = 'http://localhost:3000/workflows'; // Adjust if your backend URL is different

  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService
  ) {}

  // Workflow Endpoints
  getWorkflows(): Observable<Workflow[]> {
    return this.http.get<Workflow[]>(this.apiUrl).pipe(
      tap(() => {}), // No specific success action needed for tap here
      catchError((error) => {
        this.snackbarService.showError('Failed to fetch workflows.');
        console.error('Error fetching workflows:', error);
        return throwError(() => new Error('Failed to fetch workflows.'));
      })
    );
  }

  getWorkflow(id: string): Observable<Workflow> {
    return this.http.get<Workflow>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {}), // No specific success action needed for tap here
      catchError((error) => {
        this.snackbarService.showError(
          `Failed to fetch workflow with ID ${id}.`
        );
        console.error(`Error fetching workflow with ID ${id}:`, error);
        return throwError(
          () => new Error(`Failed to fetch workflow with ID ${id}.`)
        );
      })
    );
  }

  createWorkflow(workflow: Workflow): Observable<Workflow> {
    return this.http.post<Workflow>(this.apiUrl, workflow).pipe(
      tap(() => {}), // No specific success action needed for tap here
      catchError((error) => {
        this.snackbarService.showError('Failed to create workflow.');
        console.error('Error creating workflow:', error);
        return throwError(() => new Error('Failed to create workflow.'));
      })
    );
  }

  updateWorkflow(id: string, workflow: Workflow): Observable<Workflow> {
    return this.http.put<Workflow>(`${this.apiUrl}/${id}`, workflow).pipe(
      tap(() => {}), // No specific success action needed for tap here
      catchError((error) => {
        this.snackbarService.showError(
          `Failed to update workflow with ID ${id}.`
        );
        console.error(`Error updating workflow with ID ${id}:`, error);
        return throwError(
          () => new Error(`Failed to update workflow with ID ${id}.`)
        );
      })
    );
  }

  deleteWorkflow(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {}), // No specific success action needed for tap here
      catchError((error) => {
        this.snackbarService.showError(
          `Failed to delete workflow with ID ${id}.`
        );
        console.error(`Error deleting workflow with ID ${id}:`, error);
        return throwError(
          () => new Error(`Failed to delete workflow with ID ${id}.`)
        );
      })
    );
  }

  // Workflow Stage Endpoints
  getWorkflowStages(workflowId: string): Observable<WorkflowStage[]> {
    return this.http
      .get<WorkflowStage[]>(`${this.apiUrl}/${workflowId}/stages`)
      .pipe(
        tap(() => {}), // No specific success action needed for tap here
        catchError((error) => {
          this.snackbarService.showError(
            `Failed to fetch workflow stages for workflow with ID ${workflowId}.`
          );
          console.error(
            `Error fetching workflow stages for workflow with ID ${workflowId}:`,
            error
          );
          return throwError(
            () =>
              new Error(
                `Failed to fetch workflow stages for workflow with ID ${workflowId}.`
              )
          );
        })
      );
  }

  getWorkflowStage(
    workflowId: string,
    stageId: string
  ): Observable<WorkflowStage> {
    return this.http
      .get<WorkflowStage>(`${this.apiUrl}/${workflowId}/stages/${stageId}`)
      .pipe(
        tap(() => {}), // No specific success action needed for tap here
        catchError((error) => {
          this.snackbarService.showError(
            `Failed to fetch workflow stage with ID ${stageId} for workflow with ID ${workflowId}.`
          );
          console.error(
            `Error fetching workflow stage with ID ${stageId} for workflow with ID ${workflowId}:`,
            error
          );
          return throwError(
            () =>
              new Error(
                `Failed to fetch workflow stage with ID ${stageId} for workflow with ID ${workflowId}.`
              )
          );
        })
      );
  }

  createWorkflowStage(
    workflowId: string,
    stage: WorkflowStage
  ): Observable<WorkflowStage> {
    return this.http
      .post<WorkflowStage>(`${this.apiUrl}/${workflowId}/stages`, stage)
      .pipe(
        tap(() => {}), // No specific success action needed for tap here
        catchError((error) => {
          this.snackbarService.showError(
            `Failed to create workflow stage for workflow with ID ${workflowId}.`
          );
          console.error(
            `Error creating workflow stage for workflow with ID ${workflowId}:`,
            error
          );
          return throwError(
            () =>
              new Error(
                `Failed to create workflow stage for workflow with ID ${workflowId}.`
              )
          );
        })
      );
  }

  updateWorkflowStage(
    workflowId: string,
    stageId: string,
    stage: WorkflowStage
  ): Observable<WorkflowStage> {
    return this.http
      .put<WorkflowStage>(
        `${this.apiUrl}/${workflowId}/stages/${stageId}`,
        stage
      )
      .pipe(
        tap(() => {}), // No specific success action needed for tap here
        catchError((error) => {
          this.snackbarService.showError(
            `Failed to update workflow stage with ID ${stageId} for workflow with ID ${workflowId}.`
          );
          console.error(
            `Error updating workflow stage with ID ${stageId} for workflow with ID ${workflowId}:`,
            error
          );
          return throwError(
            () =>
              new Error(
                `Failed to update workflow stage with ID ${stageId} for workflow with ID ${workflowId}.`
              )
          );
        })
      );
  }

  deleteWorkflowStage(workflowId: string, stageId: string): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/${workflowId}/stages/${stageId}`)
      .pipe(
        tap(() => {}), // No specific success action needed for tap here
        catchError((error) => {
          this.snackbarService.showError(
            `Failed to delete workflow stage with ID ${stageId} for workflow with ID ${workflowId}.`
          );
          console.error(
            `Error deleting workflow stage with ID ${stageId} for workflow with ID ${workflowId}:`,
            error
          );
          return throwError(
            () =>
              new Error(
                `Failed to delete workflow stage with ID ${stageId} for workflow with ID ${workflowId}.`
              )
          );
        })
      );
  }

  // Stage Status Endpoints
  getStageStatuses(
    workflowId: string,
    stageId: string
  ): Observable<StageStatus[]> {
    return this.http
      .get<StageStatus[]>(
        `${this.apiUrl}/${workflowId}/stages/${stageId}/statuses`
      )
      .pipe(
        tap(() => {}), // No specific success action needed for tap here
        catchError((error) => {
          this.snackbarService.showError(
            `Failed to fetch stage statuses for workflow stage with ID ${stageId} in workflow with ID ${workflowId}.`
          );
          console.error(
            `Error fetching stage statuses for workflow stage with ID ${stageId} in workflow with ID ${workflowId}:`,
            error
          );
          return throwError(
            () =>
              new Error(
                `Failed to fetch stage statuses for workflow stage with ID ${stageId} in workflow with ID ${workflowId}.`
              )
          );
        })
      );
  }

  getStageStatus(
    workflowId: string,
    stageId: string,
    statusId: string
  ): Observable<StageStatus> {
    return this.http
      .get<StageStatus>(
        `${this.apiUrl}/${workflowId}/stages/${stageId}/statuses/${statusId}`
      )
      .pipe(
        tap(() => {}), // No specific success action needed for tap here
        catchError((error) => {
          this.snackbarService.showError(
            `Failed to fetch stage status with ID ${statusId} for workflow stage with ID ${stageId} in workflow with ID ${workflowId}.`
          );
          console.error(
            `Error fetching stage status with ID ${statusId} for workflow stage with ID ${stageId} in workflow with ID ${workflowId}:`,
            error
          );
          return throwError(
            () =>
              new Error(
                `Failed to fetch stage status with ID ${statusId} for workflow stage with ID ${stageId} in workflow with ID ${workflowId}.`
              )
          );
        })
      );
  }

  createStageStatus(
    workflowId: string,
    stageId: string,
    status: StageStatus
  ): Observable<StageStatus> {
    return this.http
      .post<StageStatus>(
        `${this.apiUrl}/${workflowId}/stages/${stageId}/statuses`,
        status
      )
      .pipe(
        tap(() => {}), // No specific success action needed for tap here
        catchError((error) => {
          this.snackbarService.showError(
            `Failed to create stage status for workflow stage with ID ${stageId} in workflow with ID ${workflowId}.`
          );
          console.error(
            `Error creating stage status for workflow stage with ID ${stageId} in workflow with ID ${workflowId}:`,
            error
          );
          return throwError(
            () =>
              new Error(
                `Failed to create stage status for workflow stage with ID ${stageId} in workflow with ID ${workflowId}.`
              )
          );
        })
      );
  }

  updateStageStatus(
    workflowId: string,
    stageId: string,
    statusId: string,
    status: StageStatus
  ): Observable<StageStatus> {
    return this.http
      .put<StageStatus>(
        `${this.apiUrl}/${workflowId}/stages/${stageId}/statuses/${statusId}`,
        status
      )
      .pipe(
        tap(() => {}), // No specific success action needed for tap here
        catchError((error) => {
          this.snackbarService.showError(
            `Failed to update stage status with ID ${statusId} for workflow stage with ID ${stageId} in workflow with ID ${workflowId}.`
          );
          console.error(
            `Error updating stage status with ID ${statusId} for workflow stage with ID ${stageId} in workflow with ID ${workflowId}:`,
            error
          );
          return throwError(
            () =>
              new Error(
                `Failed to update stage status with ID ${statusId} for workflow stage with ID ${stageId} in workflow with ID ${workflowId}.`
              )
          );
        })
      );
  }

  deleteStageStatus(
    workflowId: string,
    stageId: string,
    statusId: string
  ): Observable<any> {
    return this.http
      .delete<any>(
        `${this.apiUrl}/${workflowId}/stages/${stageId}/statuses/${statusId}`
      )
      .pipe(
        tap(() => {}), // No specific success action needed for tap here
        catchError((error) => {
          this.snackbarService.showError(
            `Failed to delete stage status with ID ${statusId} for workflow stage with ID ${stageId} in workflow with ID ${workflowId}.`
          );
          console.error(
            `Error deleting stage status with ID ${statusId} for workflow stage with ID ${stageId} in workflow with ID ${workflowId}:`,
            error
          );
          return throwError(
            () =>
              new Error(
                `Failed to delete stage status with ID ${statusId} for workflow stage with ID ${stageId} in workflow with ID ${workflowId}.`
              )
          );
        })
      );
  }
}
