import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
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
  reportStatus: 'pending' | 'generating' | 'completed' | 'failed' = 'pending';
  showReportContent: boolean = false; // New variable to control visibility
  private statusSubscription: Subscription | undefined;
  private generateReportSubscription: Subscription | undefined;
  private getReportDataSubscription: Subscription | undefined;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.checkReportStatus();
  }

  ngOnDestroy(): void {
    this.statusSubscription?.unsubscribe();
    this.generateReportSubscription?.unsubscribe();
    this.getReportDataSubscription?.unsubscribe();
  }

  checkReportStatus(): void {
    this.statusSubscription = interval(5000) // Poll every 5 seconds
      .pipe(
        startWith(0), // Check immediately on init
        switchMap(() => this.reportService.getOverallReportsStatus())
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
          console.error('Error checking report status:', error);
          this.reportStatus = 'failed';
          if (this.statusSubscription) {
            this.statusSubscription.unsubscribe();
          }
        }
      );
  }

  generateReport(): void {
    this.reportStatus = 'generating';
    this.showReportContent = false; // Hide content when generating
    this.generateReportSubscription = this.reportService
      .generateOverallReports()
      .subscribe(
        () => {
          // Start polling for status after triggering generation
          this.checkReportStatus();
        },
        (error: any) => {
          // Explicitly type error
          console.error('Error generating report:', error);
          this.reportStatus = 'failed';
        }
      );
  }

  viewReport(): void {
    this.getReportData();
  }

  getReportData(): void {
    this.getReportDataSubscription = this.reportService
      .getOverallProjectCompletionRate()
      .subscribe(
        (rate) => {
          this.overallCompletionRate = rate;
          this.showReportContent = true; // Show content after fetching data
        },
        (error: any) => {
          // Explicitly type error
          console.error('Error fetching report data:', error);
          this.reportStatus = 'failed'; // Set status to failed if fetching data fails
        }
      );
  }
}
