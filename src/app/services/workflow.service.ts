import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  // Workflow Endpoints
  getWorkflows(): Observable<Workflow[]> {
    return this.http.get<Workflow[]>(this.apiUrl);
  }

  getWorkflow(id: string): Observable<Workflow> {
    return this.http.get<Workflow>(`${this.apiUrl}/${id}`);
  }

  createWorkflow(workflow: Workflow): Observable<Workflow> {
    return this.http.post<Workflow>(this.apiUrl, workflow);
  }

  updateWorkflow(id: string, workflow: Workflow): Observable<Workflow> {
    return this.http.put<Workflow>(`${this.apiUrl}/${id}`, workflow);
  }

  deleteWorkflow(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Workflow Stage Endpoints
  getWorkflowStages(workflowId: string): Observable<WorkflowStage[]> {
    return this.http.get<WorkflowStage[]>(
      `${this.apiUrl}/${workflowId}/stages`
    );
  }

  getWorkflowStage(
    workflowId: string,
    stageId: string
  ): Observable<WorkflowStage> {
    return this.http.get<WorkflowStage>(
      `${this.apiUrl}/${workflowId}/stages/${stageId}`
    );
  }

  createWorkflowStage(
    workflowId: string,
    stage: WorkflowStage
  ): Observable<WorkflowStage> {
    return this.http.post<WorkflowStage>(
      `${this.apiUrl}/${workflowId}/stages`,
      stage
    );
  }

  updateWorkflowStage(
    workflowId: string,
    stageId: string,
    stage: WorkflowStage
  ): Observable<WorkflowStage> {
    return this.http.put<WorkflowStage>(
      `${this.apiUrl}/${workflowId}/stages/${stageId}`,
      stage
    );
  }

  deleteWorkflowStage(workflowId: string, stageId: string): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/${workflowId}/stages/${stageId}`
    );
  }

  // Stage Status Endpoints
  getStageStatuses(
    workflowId: string,
    stageId: string
  ): Observable<StageStatus[]> {
    return this.http.get<StageStatus[]>(
      `${this.apiUrl}/${workflowId}/stages/${stageId}/statuses`
    );
  }

  getStageStatus(
    workflowId: string,
    stageId: string,
    statusId: string
  ): Observable<StageStatus> {
    return this.http.get<StageStatus>(
      `${this.apiUrl}/${workflowId}/stages/${stageId}/statuses/${statusId}`
    );
  }

  createStageStatus(
    workflowId: string,
    stageId: string,
    status: StageStatus
  ): Observable<StageStatus> {
    return this.http.post<StageStatus>(
      `${this.apiUrl}/${workflowId}/stages/${stageId}/statuses`,
      status
    );
  }

  updateStageStatus(
    workflowId: string,
    stageId: string,
    statusId: string,
    status: StageStatus
  ): Observable<StageStatus> {
    return this.http.put<StageStatus>(
      `${this.apiUrl}/${workflowId}/stages/${stageId}/statuses/${statusId}`,
      status
    );
  }

  deleteStageStatus(
    workflowId: string,
    stageId: string,
    statusId: string
  ): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/${workflowId}/stages/${stageId}/statuses/${statusId}`
    );
  }
}
