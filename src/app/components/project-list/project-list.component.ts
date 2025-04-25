import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../../services/mock-data.service'; // Import MockDataService

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
})
export class ProjectListComponent {
  // Use the mockProjects from the service
  get mockProjects() {
    return this.mockDataService.mockProjects;
  }

  constructor(private mockDataService: MockDataService) {} // Inject MockDataService
}
