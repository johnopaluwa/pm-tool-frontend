import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-overall-status-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overall-status-report.component.html',
  styleUrl: './overall-status-report.component.css', // Assuming a CSS file will be created
})
export class OverallStatusReportComponent implements OnInit {
  overallStatusDistribution: { [status: string]: number } | undefined;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.reportService
      .getOverallProjectStatusDistribution()
      .subscribe((distribution) => {
        this.overallStatusDistribution = distribution;
      });
  }
}
