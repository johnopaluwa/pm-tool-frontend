import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project, ProjectService } from '../../services/project.service'; // Assuming Project interface is here
import { ReportService } from '../../services/report.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-project-reports-detail',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './project-reports-detail.component.html',
  styleUrl: './project-reports-detail.component.css',
})
export class ProjectReportsDetailComponent implements OnInit, OnDestroy {
  projectId: number | null = null;
  project: Project | undefined;
  projectPredictionsCount: number | undefined;
  projectPredictionTypeDistribution: { [type: string]: number } | undefined;
  reportStatus: 'pending' | 'generating' | 'completed' | 'failed' = 'pending';
  private paramMapSubscription: Subscription | undefined;
  private projectSubscription: Subscription | undefined;
  private generateReportSubscription: Subscription | undefined;
  private predictionsCountSubscription: Subscription | undefined;
  private typeDistributionSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.paramMapSubscription = this.route.paramMap.subscribe((params) => {
      const id = params.get('projectId');
      if (id) {
        this.projectId = +id; // Convert string to number
        this.loadProjectDetails(this.projectId);
        // Fetch report data directly as the API returns data, not status
        this.getReportData(this.projectId);
      }
    });
  }

  ngOnDestroy(): void {
    this.paramMapSubscription?.unsubscribe();
    this.projectSubscription?.unsubscribe();
    this.generateReportSubscription?.unsubscribe();
    this.predictionsCountSubscription?.unsubscribe();
    this.typeDistributionSubscription?.unsubscribe();
  }

  loadProjectDetails(projectId: number): void {
    this.projectSubscription = this.projectService
      .getProjectById(projectId)
      .subscribe((project) => {
        this.project = project;
      });
  }

  // Removed checkReportStatus as API returns data directly

  generateReport(projectId: number): void {
    // This method might need to be adjusted or removed if report generation is not a separate step
    this.reportStatus = 'generating'; // Keep status for UI feedback if needed
    this.generateReportSubscription = this.reportService
      .generateProjectReports(projectId)
      .subscribe(
        () => {
          // After triggering generation, fetch the data
          this.getReportData(projectId);
          this.reportStatus = 'completed'; // Set status to completed after triggering fetch
        },
        (error: any) => {
          console.error(
            `Error generating report for project ${projectId}:`,
            error
          );
          this.reportStatus = 'failed';
        }
      );
  }

  // Removed viewReport as getReportData is called directly

  getReportData(projectId: number): void {
    this.predictionsCountSubscription = this.reportService
      .getPredictionsCountForProject(projectId)
      .subscribe(
        (count) => {
          this.projectPredictionsCount = count;
          // Check if both subscriptions have completed before setting status to completed
          if (this.projectPredictionTypeDistribution !== undefined) {
            this.reportStatus = 'completed';
          }
        },
        (error: any) => {
          console.error(
            `Error fetching predictions count for project ${projectId}:`,
            error
          );
          this.reportStatus = 'failed'; // Set status to failed if fetching data fails
        }
      );

    this.typeDistributionSubscription = this.reportService
      .getPredictionTypeDistributionForProject(projectId)
      .subscribe(
        (distribution) => {
          this.projectPredictionTypeDistribution = distribution;
          // Check if both subscriptions have completed before setting status to completed
          if (this.projectPredictionsCount !== undefined) {
            this.reportStatus = 'completed';
          }
        },
        (error: any) => {
          console.error(
            `Error fetching prediction type distribution for project ${projectId}:`,
            error
          );
          this.reportStatus = 'failed'; // Set status to failed if fetching data fails
        }
      );
  }
}
