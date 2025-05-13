import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportService } from '../../services/report.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-overall-status-report',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './overall-status-report.component.html',
  styleUrl: './overall-status-report.component.css',
})
export class OverallStatusReportComponent implements OnInit, OnDestroy {
  overallStatusDistribution: { [status: string]: number } | undefined;
  overallCompletionRate: number | undefined;
  overallProjectTypeDistribution: { [type: string]: number } | undefined;
  overallClientIndustryDistribution: { [industry: string]: number } | undefined;
  overallTeamSizeDistribution: { [size: string]: number } | undefined;
  overallDurationDistribution: { [duration: string]: number } | undefined;
  overallTotalPredictionsCount: number | undefined;
  overallAveragePredictionsPerProject: number | undefined;
  reportStatus: 'loading' | 'generating' | 'loaded' | 'failed' = 'loading'; // Re-added generating status
  showReportContent: boolean = false;
  private generateReportSubscription: Subscription | undefined; // Re-added subscription
  private getReportDataSubscription: Subscription | undefined;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadReport(); // Attempt to load report on init
  }

  ngOnDestroy(): void {
    this.generateReportSubscription?.unsubscribe(); // Unsubscribe from generation
    this.getReportDataSubscription?.unsubscribe();
  }

  generateReport(): void {
    // Re-added generateReport method
    this.reportStatus = 'generating'; // Set status to generating
    this.showReportContent = false; // Hide content while generating
    this.generateReportSubscription = this.reportService
      .generateOverallReports() // Call the backend POST endpoint
      .subscribe(
        () => {
          this.loadReport(); // Load the report after successful generation
        },
        (error: any) => {
          console.error('Error generating report:', error);
          this.reportStatus = 'failed'; // Set status to failed on generation error
        }
      );
  }

  loadReport(): void {
    this.reportStatus = 'loading'; // Set status to loading
    this.showReportContent = false; // Hide content while loading
    this.getReportData(); // Fetch the report data
  }

  getReportData(): void {
    this.getReportDataSubscription = this.reportService
      .getOverallReport() // Fetch the full overall report
      .subscribe(
        (report) => {
          if (report) {
            this.overallCompletionRate = report.completion_rate;
            this.overallStatusDistribution = report.status_distribution;
            this.overallProjectTypeDistribution =
              report.project_type_distribution;
            this.overallClientIndustryDistribution =
              report.client_industry_distribution;
            this.overallTeamSizeDistribution = report.team_size_distribution;
            this.overallDurationDistribution = report.duration_distribution;
            this.overallTotalPredictionsCount = report.total_predictions_count;
            this.overallAveragePredictionsPerProject =
              report.average_predictions_per_project;
            this.showReportContent = true; // Show content after fetching data
            this.reportStatus = 'loaded'; // Set status to loaded on success
          } else {
            this.showReportContent = false; // Hide content if no report data
            this.reportStatus = 'failed'; // Set status to failed if no report data
          }
        },
        (error: any) => {
          console.error('Error fetching report data:', error);
          this.reportStatus = 'failed'; // Set status to failed if fetching data fails
        }
      );
  }
}
