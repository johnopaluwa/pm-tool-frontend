import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
})
export class ProjectListComponent {
  mockProjects = [
    { id: 1, name: 'Project Alpha', client: 'Client A', status: 'Active' },
    { id: 2, name: 'Project Beta', client: 'Client B', status: 'Planning' },
    { id: 3, name: 'Project Gamma', client: 'Client C', status: 'Completed' },
  ];
}
