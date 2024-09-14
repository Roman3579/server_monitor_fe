import { NgClass } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { ApiCallResult } from '../../models/api-call-result';
import { MatButtonModule } from '@angular/material/button';

interface FlattenedApiCallResult {
  targetUrl: string;
  appType: string;
  description: string;
  active: boolean;
  frontendUrl: string;
}

function flattenResults(results: ApiCallResult[]) {
  return results.map((result) => {
    return <FlattenedApiCallResult>{
      targetUrl: result.targetUrl,
      appType: result.appInfoModel.appType,
      description: result.appInfoModel.description,
      active: result.appInfoModel.appType === 'eulohy',
      frontendUrl: result.appInfoModel.frontendUrl,
    };
  });
}

@Component({
  selector: 'app-ip-overview',
  standalone: true,
  imports: [
    IpOverviewComponent,
    MatTableModule,
    MatIcon,
    NgClass,
    RouterLink,
    MatTooltipModule,
    MatButtonModule,
  ],
  templateUrl: './ip-overview.component.html',
  styleUrl: './ip-overview.component.scss',
})
export class IpOverviewComponent {
  ip = input<string>();
  @Input({ transform: flattenResults }) results: Array<FlattenedApiCallResult> =
    [];
  displayedColumns = [
    'targetUrl',
    'appType',
    'description',
    'active',
    'actionsColumn',
  ];
}
