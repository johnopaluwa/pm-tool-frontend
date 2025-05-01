import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project, ProjectService } from '../../services/project.service'; // Assuming Project interface is here
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-project-reports-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-reports-detail.component.html',
  styleUrl: './project-reports-detail.component.css', // Assuming a CSS file will be created
})
export class ProjectReportsDetailComponent implements OnInit {
  projectId: number | null = null;
  project: Project | undefined;
  projectPredictionsCount: number | undefined;
  projectPredictionTypeDistribution: { [type: string]: number } | undefined;

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('projectId');
      if (id) {
        this.projectId = +id; // Convert string to number
        this.loadProjectReports(this.projectId);
      }
    });
  }

  loadProjectReports(projectId: number): void {
    // Fetch project details
    this.projectService.getProjectById(projectId).subscribe((project) => {
      this.project = project;
    });

    // Fetch project-specific reports
    this.reportService
      .getPredictionsCountForProject(projectId)
      .subscribe((count) => {
        this.projectPredictionsCount = count;
      });

    this.reportService
      .getPredictionTypeDistributionForProject(projectId)
      .subscribe((distribution) => {
        this.projectPredictionTypeDistribution = distribution;
      });
  }
}
