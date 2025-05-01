import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-overall-completion-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overall-completion-report.component.html',
  styleUrl: './overall-completion-report.component.css', // Assuming a CSS file will be created
})
export class OverallCompletionReportComponent implements OnInit {
  overallCompletionRate: number | undefined;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.reportService.getOverallProjectCompletionRate().subscribe((rate) => {
      this.overallCompletionRate = rate;
    });
  }
}
