import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  PredictionReview,
  PredictionReviewService,
} from '../../services/prediction-review.service'; // Import PredictionReviewService
import { Project, ProjectService } from '../../services/project.service'; // Import ProjectService

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
})
export class ProjectListComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  latestPredictionReviews: {
    [projectId: string]: PredictionReview | undefined;
  } = {};
  private subscriptions: Subscription[] = [];

  constructor(
    private projectService: ProjectService,
    private predictionReviewService: PredictionReviewService // Inject PredictionReviewService
  ) {}

  ngOnInit() {
    const projectsSub = this.projectService
      .getProjects()
      .pipe(
        switchMap((projects) => {
          this.projects = projects;
          if (projects.length === 0) {
            return []; // Return empty array if no projects
          }
          // For each project, get its latest prediction review
          const reviewObservables = projects.map((project) =>
            this.predictionReviewService
              .getPredictionReviewsByProjectId(project.id)
              .pipe(
                map((reviews) => {
                  // Find the latest review for this project
                  return reviews.sort(
                    (a, b) =>
                      new Date(b.generatedAt).getTime() -
                      new Date(a.generatedAt).getTime()
                  )[0];
                })
              )
          );
          return forkJoin(reviewObservables).pipe(
            map((latestReviews) => {
              // Map latest reviews to project IDs
              const reviewsMap: {
                [projectId: string]: PredictionReview | undefined;
              } = {};
              projects.forEach((project, index) => {
                reviewsMap[project.id] = latestReviews[index];
              });
              return reviewsMap;
            })
          );
        })
      )
      .subscribe((latestReviewsMap) => {
        this.latestPredictionReviews = latestReviewsMap;
      });

    this.subscriptions.push(projectsSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  hasPredictionRun(projectId: string): boolean {
    const review = this.latestPredictionReviews[projectId];
    return !!review; // Return true if a review exists, false otherwise
  }
}
