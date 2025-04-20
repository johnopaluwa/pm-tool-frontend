import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent {
  mockReports = [
    { title: 'Project Completion Rate', value: '85%' },
    { title: 'Average Bug Resolution Time', value: '3 days' },
    { title: 'Predicted vs Actual Stories', value: '90% match' },
  ];
}
