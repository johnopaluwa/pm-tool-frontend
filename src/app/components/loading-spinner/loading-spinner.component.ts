import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-overlay">
      <div class="spinner"></div>
    </div>
  `,
  styleUrls: ['./loading-spinner.component.css'],
})
export class LoadingSpinnerComponent {}
