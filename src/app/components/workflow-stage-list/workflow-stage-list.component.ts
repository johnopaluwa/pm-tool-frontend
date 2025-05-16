import { CommonModule } from '@angular/common'; // Import CommonModule
import { Component, Input, OnInit } from '@angular/core'; // Import Input and OnInit
import { RouterModule } from '@angular/router'; // Import RouterModule
import { Observable } from 'rxjs'; // Import Observable
import {
  WorkflowService,
  WorkflowStage,
} from '../../services/workflow.service'; // Import WorkflowService and WorkflowStage interface

@Component({
  selector: 'app-workflow-stage-list',
  standalone: true, // Mark as standalone
  imports: [CommonModule, RouterModule], // Removed StageStatusListComponent
  templateUrl: './workflow-stage-list.component.html',
  styleUrl: './workflow-stage-list.component.css',
})
export class WorkflowStageListComponent implements OnInit {
  // Implement OnInit
  @Input() workflowId!: string; // Add workflowId input property with definite assignment assertion
  stages$!: Observable<WorkflowStage[]>; // Observable to hold workflow stages

  constructor(private workflowService: WorkflowService) {} // Inject WorkflowService

  ngOnInit(): void {
    if (this.workflowId) {
      this.stages$ = this.workflowService.getWorkflowStages(this.workflowId); // Fetch stages if workflowId is available
    }
  }
}
