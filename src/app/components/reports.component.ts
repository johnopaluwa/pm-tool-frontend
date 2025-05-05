import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router'; // Import RouterLink
import { Subscription } from 'rxjs';
import { Project, ProjectService } from '../services/project.service'; // Assuming Project interface is here

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterLink], // Add RouterLink here
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit, OnDestroy {
  private _allProjects: Project[] = []; // Store all fetched projects
  private projectsSubscription: Subscription | undefined;

  get projects(): Project[] {
    // Filter projects to show only those with reportGenerated set to true
    return this._allProjects.filter((project) => project.reportGenerated);
  }

  constructor(
    private projectService: ProjectService // Inject ProjectService
  ) {}

  ngOnInit(): void {
    // Fetch list of projects for the overview
    this.projectsSubscription = this.projectService
      .getProjects()
      .subscribe((projects: Project[]) => {
        this._allProjects = projects; // Store all projects
      });
  }

  ngOnDestroy(): void {
    this.projectsSubscription?.unsubscribe();
  }

  // No longer need onProjectSelect or onProjectDropdownChange in the overview component
}
