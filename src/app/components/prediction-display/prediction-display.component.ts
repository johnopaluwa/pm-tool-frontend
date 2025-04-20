import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Prediction } from '../../services/prediction.service';

@Component({
  selector: 'app-prediction-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prediction-display.component.html',
  styleUrls: ['./prediction-display.component.css'],
})
export class PredictionDisplayComponent implements OnInit {
  allPredictions: Prediction[] = [];
  filteredUserStoryPredictions: Prediction[] = [];
  filteredBugPredictions: Prediction[] = [];
  loading = false;
  error: string | null = null;
  filterProject: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.filterProject = params['project'] || null;
      this.loadAndFilterPredictions();
    });
  }

  loadAndFilterPredictions() {
    const data = sessionStorage.getItem('latestPredictions');
    if (data) {
      this.allPredictions = JSON.parse(data);
      let predictionsToDisplay = this.allPredictions;

      if (this.filterProject) {
        predictionsToDisplay = this.allPredictions.filter(
          (p) => p.sourceProject === this.filterProject
        );
        if (predictionsToDisplay.length === 0) {
          this.error = `No predictions found for project "${this.filterProject}".`;
        } else {
          this.error = null; // Clear error if predictions are found for the project
        }
      } else {
        this.error = null; // Clear error if no filter is applied
      }

      this.filteredUserStoryPredictions = predictionsToDisplay.filter(
        (p) => p.type === 'userStory'
      );
      this.filteredBugPredictions = predictionsToDisplay.filter(
        (p) => p.type === 'bug'
      );

      if (this.allPredictions.length === 0) {
        this.error = 'No predictions found. Please generate predictions first.';
      }
    } else {
      this.error = 'No predictions found. Please generate predictions first.';
    }
  }

  acceptPrediction(pred: Prediction) {
    pred.status = 'accepted';
  }

  rejectPrediction(pred: Prediction) {
    pred.status = 'rejected';
  }

  editPrediction(pred: Prediction) {
    // Placeholder for edit logic (could open a modal)
    alert('Edit functionality not implemented yet.');
  }

  finishReview() {
    // Placeholder for finish logic (could send feedback to backend)
    alert('Review finished! (Feedback not yet sent to backend)');
    this.router.navigate(['/dashboard']);
  }

  viewPredictionDetail(predictionId: string) {
    this.router.navigate(['/predictions/detail', predictionId]);
  }
}
