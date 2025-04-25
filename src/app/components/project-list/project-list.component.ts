import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Project, ProjectService } from '../../services/project.service'; // Import ProjectService

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];

  constructor(private projectService: ProjectService) {} // Inject ProjectService

  ngOnInit() {
    this.projectService.getProjects().subscribe((data) => {
      this.projects = data;
    });
  }
}
