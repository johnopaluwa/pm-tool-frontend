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
  projectId: string | null = null;
  project: Project | undefined;
  projectPredictionsCount: number | undefined;
  projectPredictionTypeDistribution: { [type: string]: number } | undefined;
  projectPredictionStatusDistribution: { [status: string]: number } | undefined;
  projectPredictionPriorityDistribution:
    | { [priority: string]: number }
    | undefined;
  projectPredictionSeverityDistribution:
    | { [severity: string]: number }
    | undefined;
  projectAverageEstimatedTime: number | undefined;
  projectTopKeywords: string[] | undefined;
  projectTechStackList: string[] | undefined;
  projectTotalEstimatedTimeForBugsAndStories: number | undefined; // Added for the sum of estimated time for bugs and user stories
  reportStatus: 'pending' | 'generating' | 'completed' | 'failed' = 'pending';
  private paramMapSubscription: Subscription | undefined;
  private projectSubscription: Subscription | undefined;
  private generateReportSubscription: Subscription | undefined;
  private getReportDataSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.paramMapSubscription = this.route.paramMap.subscribe((params) => {
      const id = params.get('projectId');
      if (id) {
        this.projectId = id;
        this.loadProjectDetails(id);
        // Fetch report data directly as the API returns data, not status
        this.getReportData(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.paramMapSubscription?.unsubscribe();
    this.projectSubscription?.unsubscribe();
    this.generateReportSubscription?.unsubscribe();
    this.getReportDataSubscription?.unsubscribe();
  }

  loadProjectDetails(projectId: string): void {
    this.projectSubscription = this.projectService
      .getProjectById(projectId)
      .subscribe((project) => {
        this.project = project;
      });
  }

  generateReport(projectId: string): void {
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

  getReportData(projectId: string): void {
    this.getReportDataSubscription = this.reportService
      .getProjectReport(projectId) // Fetch the full project report
      .subscribe(
        (report) => {
          if (report) {
            this.projectPredictionsCount = report.predictions_count;
            this.projectPredictionTypeDistribution =
              report.prediction_type_distribution;
            this.projectPredictionStatusDistribution =
              report.prediction_status_distribution;
            this.projectPredictionPriorityDistribution =
              report.prediction_priority_distribution;
            this.projectPredictionSeverityDistribution =
              report.prediction_severity_distribution;
            this.projectAverageEstimatedTime = report.average_estimated_time;
            this.projectTopKeywords = report.top_keywords;
            this.projectTechStackList = report.tech_stack_list;
            this.projectTotalEstimatedTimeForBugsAndStories =
              report.total_estimated_time; // Extract the new value
            this.reportStatus = 'completed'; // Set status to completed after fetching data
          } else {
            this.reportStatus = 'failed'; // Set status to failed if no report data
          }
        },
        (error: any) => {
          console.error('Error fetching project report data:', error);
          this.reportStatus = 'failed'; // Set status to failed if fetching data fails
        }
      );
  }
}
