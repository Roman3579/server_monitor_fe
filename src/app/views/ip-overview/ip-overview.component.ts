import { AfterViewInit, Component, Input, input } from '@angular/core';
import { ApiCallResult } from '../../models/api-call-result';
import { JsonPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

interface FlattenedApiCallResult {
  targetUrl: string;
  appType: string;
  description: string;
}

function flattenResults(results: ApiCallResult[]) {
  return results.map((result) => {
    return <FlattenedApiCallResult>{
      targetUrl: result.targetUrl,
      appType: result.appInfoModel.appType,
      description: result.appInfoModel.description,
    };
  });
}

@Component({
  selector: 'app-ip-overview',
  standalone: true,
  imports: [IpOverviewComponent, MatTableModule],
  templateUrl: './ip-overview.component.html',
  styleUrl: './ip-overview.component.scss',
})
export class IpOverviewComponent {
  ip = input<string>();
  @Input({ transform: flattenResults }) results: Array<FlattenedApiCallResult> =
    [];
  displayedColumns = ['targetUrl', 'appType', 'description'];
}
