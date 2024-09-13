import { NgFor } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiCallResult } from '../../models/api-call-result';
import { AppInfoService } from '../../services/app-info.service';
import { IpOverviewComponent } from '../ip-overview/ip-overview.component';

@Component({
  selector: 'app-apps-overview',
  standalone: true,
  imports: [IpOverviewComponent, NgFor, MatProgressSpinnerModule],
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
    this.loadingData = true;
    const subscription = this.appInfoService.getGroupedAppInfo().subscribe({
      next: (res) => {
        console.log(res);
        this.appInfos = res;
        this.loadingData = false;
      },
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  getIps() {
    return Object.keys(this.appInfos);
  }
}
