import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../services/mock-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  projects: any[] = []; // Or define a Project interface

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.projects = this.mockDataService.mockProjects; // Assuming mockProjects is public or add a getProjects method
  }
}
