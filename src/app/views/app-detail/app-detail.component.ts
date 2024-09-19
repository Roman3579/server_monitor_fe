import { Component, computed, DestroyRef, inject, input } from '@angular/core';
import { ApiCallResult } from '../../models/api-call-result';
import { AppInfoService } from '../../services/app-info.service';
import { JsonPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-app-detail',
  standalone: true,
  imports: [
    JsonPipe,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatCardModule,
  ],
  templateUrl: './app-detail.component.html',
  styleUrl: './app-detail.component.scss',
})
export class AppDetailComponent {
  private appInfoService = inject(AppInfoService);
  private destroyRef = inject(DestroyRef);
  target = input.required<string>();
  targetOrigin = computed(() =>
    this.appInfoService.extractOrigin(this.target())
  );
  appInfo?: ApiCallResult;

  constructor() {
    const dataSubscription = this.appInfoService.appInfoData.subscribe({
      next: (data) => {
        this.appInfo = data.apiCallResults.find(
          (element) => element.targetUrl === this.target()
        );
      },
    });
    this.destroyRef.onDestroy(() => {
      dataSubscription.unsubscribe();
    });
  }
}
