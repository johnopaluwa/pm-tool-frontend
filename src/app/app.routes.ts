import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component';
import { NewProjectFormComponent } from './components/new-project-form/new-project-form.component';
import { PredictionDisplayComponent } from './components/prediction-display/prediction-display.component';
import { PredictionOverviewComponent } from './components/prediction-overview/prediction-overview.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ReportsComponent } from './components/reports.component';
import { SettingsComponent } from './components/settings.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'projects', component: ProjectListComponent },
  { path: 'projects/new', component: NewProjectFormComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'predictions/overview', component: PredictionOverviewComponent },
  { path: 'predictions/list', component: PredictionDisplayComponent },
  { path: 'projects/:id', component: ProjectDetailComponent },
];
