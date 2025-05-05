import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project, ProjectService } from '../../services/project.service'; // Import ProjectService

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
})
export class ProjectListComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  private projectsSubscription: Subscription | undefined;

  constructor(private projectService: ProjectService) {} // Inject ProjectService

  ngOnInit() {
    this.projectsSubscription = this.projectService
      .getProjects()
      .subscribe((data) => {
        this.projects = data;
      });
  }

  ngOnDestroy(): void {
    this.projectsSubscription?.unsubscribe();
  }
}
