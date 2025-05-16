import { CommonModule } from '@angular/common'; // Import CommonModule
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { Observable } from 'rxjs'; // Import Observable
import { Workflow, WorkflowService } from '../../services/workflow.service'; // Import WorkflowService and Workflow interface

@Component({
  selector: 'app-workflow-list',
  standalone: true, // Mark as standalone
  imports: [CommonModule, RouterModule], // Add CommonModule and RouterModule to imports
  templateUrl: './workflow-list.component.html',
  styleUrl: './workflow-list.component.css',
})
export class WorkflowListComponent implements OnInit {
  // Implement OnInit
  workflows$!: Observable<Workflow[]>; // Use Observable to hold workflows and apply definite assignment assertion

  constructor(private workflowService: WorkflowService) {} // Inject WorkflowService

  ngOnInit(): void {
    this.workflows$ = this.workflowService.getWorkflows(); // Fetch workflows on init
  }
}
