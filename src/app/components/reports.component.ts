import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router'; // Import RouterLink
import { Project, ProjectService } from '../services/project.service'; // Assuming Project interface is here

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterLink], // Add RouterLink here
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  projects: Project[] = [];

  constructor(
    private projectService: ProjectService // Inject ProjectService
  ) {}

  ngOnInit(): void {
    // Fetch list of projects for the overview
    this.projectService.getProjects().subscribe((projects: Project[]) => {
      this.projects = projects;
    });
  }

  // No longer need onProjectSelect or onProjectDropdownChange in the overview component
}
