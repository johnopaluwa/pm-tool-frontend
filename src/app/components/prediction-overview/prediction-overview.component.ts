import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Prediction } from '../../services/prediction.service'; // Assuming Prediction interface is here or in a shared model file

@Component({
  selector: 'app-prediction-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prediction-overview.component.html',
  styleUrl: './prediction-overview.component.css',
})
export class PredictionOverviewComponent implements OnInit {
  groupedPredictions: { [project: string]: Prediction[] } = {};
  loading = false;
  error: string | null = null;

  get projectKeys(): string[] {
    return Object.keys(this.groupedPredictions);
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadRecentPredictions(); // Load predictions when the component initializes
  }

  loadRecentPredictions() {
    // In a real app, this would fetch a limited list of recent predictions
    // For now, we'll load all and group them, similar to PredictionDisplayComponent
    const data = sessionStorage.getItem('latestPredictions');
    if (data) {
      const predictions: Prediction[] = JSON.parse(data);
      // Group predictions by source project
      this.groupedPredictions = predictions.reduce((acc, prediction) => {
        if (!acc[prediction.sourceProject]) {
          acc[prediction.sourceProject] = [];
        }
        acc[prediction.sourceProject].push(prediction);
        return acc;
      }, {} as { [project: string]: Prediction[] });
    } else {
      this.error = 'No recent prediction activity found.';
    }
  }

  reviewPredictions(project: string) {
    // Navigate to the detailed prediction list page, potentially filtered by project
    // The route for the detailed list is now /predictions/list
    // We can pass the project as a query parameter for filtering
    this.router.navigate(['/predictions/list'], {
      queryParams: { project: project },
    });
  }
}
