import { Routes } from '@angular/router';
import { CustomFieldDefinitionsComponent } from './app/components/custom-field-definitions/custom-field-definitions.component'; // Import the new component
import { DashboardComponent } from './components/dashboard.component';
import { EditProjectPageComponent } from './components/edit-project-page/edit-project-page.component'; // Import EditProjectPageComponent
import { NewProjectFormComponent } from './components/new-project-form/new-project-form.component';
import { OverallCompletionReportComponent } from './components/overall-completion-report/overall-completion-report.component'; // Import new component
import { OverallStatusReportComponent } from './components/overall-status-report/overall-status-report.component'; // Import new component
import { PredictionDisplayComponent } from './components/prediction-display/prediction-display.component';
import { PredictionOverviewComponent } from './components/prediction-overview/prediction-overview.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectReportsDetailComponent } from './components/project-reports-detail/project-reports-detail.component'; // Import new component
import { ReportsComponent } from './components/reports.component';
import { SettingsComponent } from './components/settings.component';
import { StageStatusDetailComponent } from './components/stage-status-detail/stage-status-detail.component'; // Import StageStatusDetailComponent
import { WorkflowDetailComponent } from './components/workflow-detail/workflow-detail.component'; // Import WorkflowDetailComponent
import { WorkflowListComponent } from './components/workflow-list/workflow-list.component'; // Import WorkflowListComponent
import { WorkflowManagementComponent } from './components/workflow-management/workflow-management.component'; // Import WorkflowManagementComponent
import { WorkflowStageDetailComponent } from './components/workflow-stage-detail/workflow-stage-detail.component'; // Import WorkflowStageDetailComponent

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'projects', component: ProjectListComponent },
  { path: 'projects/new', component: NewProjectFormComponent },
  { path: 'projects/edit/:id', component: EditProjectPageComponent }, // Add route for editing projects
  { path: 'reports', component: ReportsComponent }, // Reports Overview
  {
    path: 'reports/overall-completion',
    component: OverallCompletionReportComponent,
  }, // Overall Completion Detail
  { path: 'reports/overall-status', component: OverallStatusReportComponent }, // Overall Status Detail
  {
    path: 'reports/project/:projectId',
    component: ProjectReportsDetailComponent,
  }, // Project Reports Detail
  { path: 'settings', component: SettingsComponent },
  {
    path: 'custom-field-definitions',
    component: CustomFieldDefinitionsComponent,
  }, // Add route for custom fields
  { path: 'predictions/overview', component: PredictionOverviewComponent },
  { path: 'predictions/list', component: PredictionDisplayComponent },
  { path: 'projects/:id', component: ProjectDetailComponent },
  {
    // Workflow Management Routes
    path: 'workflows',
    component: WorkflowManagementComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: WorkflowListComponent },
      { path: 'new', component: WorkflowDetailComponent },
      {
        path: ':workflowId',
        component: WorkflowDetailComponent,
        children: [
          { path: 'stages/new', component: WorkflowStageDetailComponent },
          {
            path: 'stages/:stageId',
            component: WorkflowStageDetailComponent,
            children: [
              // Stage status routes moved here
              { path: 'statuses/new', component: StageStatusDetailComponent },
              {
                path: 'statuses/:statusId',
                component: StageStatusDetailComponent,
              },
            ],
          },
        ],
      },
    ],
  },
];
