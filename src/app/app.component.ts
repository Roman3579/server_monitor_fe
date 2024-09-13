import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppsOverviewComponent } from './views/apps-overview/apps-overview.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppsOverviewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'union_utilities_fe';
}
