import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Import RouterModule

@Component({
  selector: 'app-workflow-management',
  standalone: true, // Mark as standalone
  imports: [RouterModule], // Add RouterModule to imports
  templateUrl: './workflow-management.component.html',
  styleUrl: './workflow-management.component.css',
})
export class WorkflowManagementComponent {}
