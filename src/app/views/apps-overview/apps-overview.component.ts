import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { AppInfoService } from '../../services/app-info.service';
import { ApiCallResult } from '../../models/api-call-result';
import { IpOverviewComponent } from '../ip-overview/ip-overview.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-apps-overview',
  standalone: true,
  imports: [IpOverviewComponent, NgFor],
  templateUrl: './apps-overview.component.html',
  styleUrl: './apps-overview.component.scss',
})
export class AppsOverviewComponent implements OnInit {
  appInfos: { [key: string]: ApiCallResult[] } = {};

  constructor(
    private appInfoService: AppInfoService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    const anotherSub = this.appInfoService.getGroupedAppInfo().subscribe({
      next: (res) => {
        console.log(res);
        this.appInfos = res;
      },
    });
    this.destroyRef.onDestroy(() => {
      anotherSub.unsubscribe();
    });
  }

  getIps() {
    return Object.keys(this.appInfos);
  }
}
