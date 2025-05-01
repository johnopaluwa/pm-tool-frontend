import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { filter, startWith, switchMap } from 'rxjs/operators';
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
  showReportContent: boolean = false; // New variable to control visibility
  private statusSubscription: Subscription | undefined;

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
        this.loadProjectDetails(this.projectId);
        this.checkReportStatus(this.projectId);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }

  loadProjectDetails(projectId: number): void {
    this.projectService.getProjectById(projectId).subscribe((project) => {
      this.project = project;
    });
  }

  checkReportStatus(projectId: number): void {
    this.reportStatus = 'pending'; // Set initial status
    this.statusSubscription = interval(5000) // Poll every 5 seconds
      .pipe(
        startWith(0), // Check immediately on init
        switchMap(() => this.reportService.getProjectReportsStatus(projectId)),
        filter((response) => response !== undefined) // Only proceed if response is not undefined
      )
      .subscribe(
        (response) => {
          this.reportStatus = response.status as
            | 'pending'
            | 'generating'
            | 'completed'
            | 'failed';
          if (this.reportStatus === 'completed') {
            // Report is generated, no need to fetch data immediately
            if (this.statusSubscription) {
              this.statusSubscription.unsubscribe();
            }
          } else if (this.reportStatus === 'failed') {
            if (this.statusSubscription) {
              this.statusSubscription.unsubscribe();
            }
          }
        },
        (error: any) => {
          // Explicitly type error
          console.error(
            `Error checking report status for project ${projectId}:`,
            error
          );
          this.reportStatus = 'failed';
          if (this.statusSubscription) {
            this.statusSubscription.unsubscribe();
          }
        }
      );
  }

  generateReport(projectId: number): void {
    this.reportStatus = 'generating';
    this.showReportContent = false; // Hide content when generating
    this.reportService.generateProjectReports(projectId).subscribe(
      () => {
        // Start polling for status after triggering generation
        this.checkReportStatus(projectId);
      },
      (error: any) => {
        // Explicitly type error
        console.error(
          `Error generating report for project ${projectId}:`,
          error
        );
        this.reportStatus = 'failed';
      }
    );
  }

  viewReport(projectId: number): void {
    this.getReportData(projectId);
  }

  getReportData(projectId: number): void {
    this.reportService.getPredictionsCountForProject(projectId).subscribe(
      (count) => {
        this.projectPredictionsCount = count;
        this.showReportContent = true; // Show content after fetching data
      },
      (error: any) => {
        // Explicitly type error
        console.error(
          `Error fetching predictions count for project ${projectId}:`,
          error
        );
        this.reportStatus = 'failed'; // Set status to failed if fetching data fails
      }
    );

    this.reportService
      .getPredictionTypeDistributionForProject(projectId)
      .subscribe(
        (distribution) => {
          this.projectPredictionTypeDistribution = distribution;
          this.showReportContent = true; // Show content after fetching data
        },
        (error: any) => {
          // Explicitly type error
          console.error(
            `Error fetching prediction type distribution for project ${projectId}:`,
            error
          );
          this.reportStatus = 'failed'; // Set status to failed if fetching data fails
        }
      );
  }
}
