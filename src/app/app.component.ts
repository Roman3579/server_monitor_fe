import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppsOverviewComponent } from './views/apps-overview/apps-overview.component';
import { LoadingDialogComponent } from './views/shared/loading-dialog/loading-dialog.component';
import { NavigationComponent } from './views/navigation/navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AppsOverviewComponent,
    LoadingDialogComponent,
    NavigationComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'union_utilities_fe';
}
