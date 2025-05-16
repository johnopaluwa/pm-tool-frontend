import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // Import ActivatedRoute
import { Observable, of, Subject } from 'rxjs'; // Import combineLatest, Subject, and of
import { tap } from 'rxjs/operators'; // Import tap

import { StageStatus, WorkflowService } from '../../services/workflow.service';

@Component({
  selector: 'app-stage-status-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './stage-status-list.component.html',
  styleUrl: './stage-status-list.component.css',
})
export class StageStatusListComponent implements OnInit {
  @Input() workflowId!: string;
  @Input() stageId!: string;
  statuses$!: Observable<StageStatus[]>;

  private refreshStatuses$ = new Subject<void>(); // Subject to trigger refresh

  constructor(
    private workflowService: WorkflowService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute // Inject ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Initial fetch using the @Input properties
    this.fetchStatuses(this.workflowId, this.stageId);
  }

  onAddStatusClick(): void {
    console.log('Add New Status button clicked, navigating programmatically');
    console.log(
      'Navigating with workflowId:',
      this.workflowId,
      'and stageId:',
      this.stageId
    );
    this.router.navigate([
      '/workflows',
      this.workflowId,
      'stages',
      this.stageId,
      'statuses',
      'new',
    ]);
    // No need to manually detect changes here, the navigation will handle it
  }

  // Method to trigger status list refresh
  refreshStatuses(workflowId: string, stageId: string): void {
    // Accept workflowId and stageId as parameters
    console.log('Refreshing status list with provided IDs:', {
      workflowId,
      stageId,
    });
    this.fetchStatuses(workflowId, stageId); // Call fetchStatuses with provided IDs
  }

  private fetchStatuses(workflowId: string, stageId: string): void {
    // Accept workflowId and stageId as parameters
    console.log('Fetching statuses with provided IDs:', {
      workflowId,
      stageId,
    });

    if (workflowId && stageId) {
      this.statuses$ = this.workflowService
        .getStageStatuses(workflowId, stageId)
        .pipe(
          tap((statuses) =>
            console.log('Statuses fetched with provided IDs:', statuses)
          )
        );
    } else {
      console.log('WorkflowId or StageId not available, skipping fetch.');
      this.statuses$ = of([]); // Assign an observable of an empty array
    }
  }
}
