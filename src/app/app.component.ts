import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavigationComponent,
    LoadingSpinnerComponent,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'pm-frontend';
  loading$: Observable<boolean>;

  constructor(private loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
  }
}
