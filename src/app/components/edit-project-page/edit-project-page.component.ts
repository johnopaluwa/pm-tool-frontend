import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Project, ProjectService } from '../../services/project.service'; // Import Project and ProjectService

@Component({
  selector: 'app-edit-project-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-project-page.component.html',
  styleUrl: './edit-project-page.component.css',
})
export class EditProjectPageComponent implements OnInit {
  project: Project | undefined;
  projectId: string | null = null;

  techStackOptions = [
    // Add techStackOptions array
    'React',
    'Angular',
    'Vue',
    'Node',
    'Python',
    'AWS',
    'Azure',
    'Other',
  ];

  // Add properties for all project fields here, initialized with default values or fetched project data
  projectName: string = '';
  client: string = '';
  description: string = '';
  projectType: string = '';
  clientIndustry: string = '';
  techStack: string[] = [];
  teamSize: string = '';
  duration: string = '';
  keywords: string = '';
  businessSpecification: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    if (this.projectId) {
      this.projectService.getProjectById(this.projectId).subscribe({
        next: (project) => {
          this.project = project;
          // Populate form fields with fetched project data
          if (project) {
            this.projectName = project.name;
            this.client = project.client;
            this.description = project.description;
            this.projectType = project.projectType;
            this.clientIndustry = project.clientIndustry;
            this.techStack = project.techStack;
            this.teamSize = project.teamSize;
            this.duration = project.duration;
            this.keywords = project.keywords;
            this.businessSpecification = project.businessSpecification;
          }
        },
        error: (error) => {
          console.error('Error fetching project:', error);
          // TODO: Display user-friendly error message and/or navigate back
        },
      });
    } else {
      // TODO: Handle case where project ID is not provided (e.g., navigate back or show error)
      console.error('Project ID not provided in route.');
    }
  }

  onTechStackChange(event: any) {
    // Add onTechStackChange method
    const tech = event.target.value;
    if (event.target.checked) {
      this.techStack.push(tech);
    } else {
      const index = this.techStack.indexOf(tech);
      if (index > -1) {
        this.techStack.splice(index, 1);
      }
    }
  }

  saveProject(): void {
    if (!this.projectId) {
      console.error('Cannot save project: Project ID is missing.');
      // TODO: Show error message
      return;
    }

    // Create an updated project object from form fields
    const updatedProject: Partial<Project> = {
      name: this.projectName,
      client: this.client,
      description: this.description,
      projectType: this.projectType,
      clientIndustry: this.clientIndustry,
      techStack: this.techStack,
      teamSize: this.teamSize,
      duration: this.duration,
      keywords: this.keywords,
      businessSpecification: this.businessSpecification,
      // Do not include status or reportGenerated as they are not edited here
    };

    this.projectService
      .updateProject(this.projectId, updatedProject)
      .subscribe({
        next: (project) => {
          console.log('Project updated successfully:', project);
          // TODO: Show success message
          this.router.navigate(['/projects', this.projectId]); // Navigate back to project detail page
        },
        error: (error) => {
          console.error('Error updating project:', error);
          // TODO: Show error message
        },
      });
  }

  cancelEditing(): void {
    if (this.projectId) {
      this.router.navigate(['/projects', this.projectId]); // Navigate back to project detail page
    } else {
      this.router.navigate(['/projects']); // Navigate to projects list if no ID
    }
  }
}
