import { NgFor } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiCallResult } from '../../models/api-call-result';
import { AppInfoService } from '../../services/app-info.service';
import { IpOverviewComponent } from '../ip-overview/ip-overview.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-apps-overview',
  standalone: true,
  imports: [
    IpOverviewComponent,
    NgFor,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconButton,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './apps-overview.component.html',
  styleUrl: './apps-overview.component.scss',
})
export class AppsOverviewComponent implements OnInit {
  appInfos: { [key: string]: ApiCallResult[] } = {};
  loadingData = false;

  constructor(
    private appInfoService: AppInfoService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loadingData = true;
    const subscription = this.appInfoService.getGroupedAppInfo().subscribe({
      next: (res) => {
        this.appInfos = res;
        this.loadingData = false;
      },
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  refreshData() {
    this.appInfoService.refreshAppInfo();
    this.loadData();
  }

  getIps() {
    return Object.keys(this.appInfos);
  }
}
