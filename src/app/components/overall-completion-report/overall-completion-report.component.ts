import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportService } from '../../services/report.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-overall-completion-report',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './overall-completion-report.component.html',
  styleUrl: './overall-completion-report.component.css',
})
export class OverallCompletionReportComponent implements OnInit, OnDestroy {
  overallCompletionRate: number | undefined;
  overallStatusDistribution: { [status: string]: number } | undefined; // New property for status distribution
  overallProjectTypeDistribution: { [type: string]: number } | undefined;
  overallClientIndustryDistribution: { [industry: string]: number } | undefined;
  overallTeamSizeDistribution: { [size: string]: number } | undefined;
  overallDurationDistribution: { [duration: string]: number } | undefined;
  overallTotalPredictionsCount: number | undefined;
  overallAveragePredictionsPerProject: number | undefined;
  showReportContent: boolean = false; // Variable to control visibility
  isLoading: boolean = false; // Variable to control loading spinner
  private getReportDataSubscription: Subscription | undefined;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.getReportData(); // Fetch report data on init
  }

  ngOnDestroy(): void {
    this.getReportDataSubscription?.unsubscribe();
  }

  getReportData(): void {
    this.isLoading = true; // Show loading spinner
    this.showReportContent = false; // Hide content while loading
    this.getReportDataSubscription = this.reportService
      .getOverallReport() // Call getOverallReport to get the full report object
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
          } else {
            this.showReportContent = false; // Hide content if no report data
          }
          this.isLoading = false; // Hide loading spinner
        },
        (error: any) => {
          console.error('Error fetching report data:', error);
          this.showReportContent = false; // Hide content if fetching data fails
          this.isLoading = false; // Hide loading spinner
        }
      );
  }

  // Renamed generateReport to retryGeneration to reflect its new purpose
  retryGeneration(): void {
    this.getReportData(); // Retry fetching data
  }

  // Helper to get object keys for *ngFor in template
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
