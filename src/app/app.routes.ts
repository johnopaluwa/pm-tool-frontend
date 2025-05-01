import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component';
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

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'projects', component: ProjectListComponent },
  { path: 'projects/new', component: NewProjectFormComponent },
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
  { path: 'predictions/overview', component: PredictionOverviewComponent },
  { path: 'predictions/list', component: PredictionDisplayComponent },
  { path: 'projects/:id', component: ProjectDetailComponent },
];
