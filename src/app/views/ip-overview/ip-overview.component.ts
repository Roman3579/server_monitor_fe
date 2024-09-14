import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { ApiCallResult } from '../../models/api-call-result';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

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
    MatSortModule,
    MatIcon,
    NgClass,
    RouterLink,
    MatTooltipModule,
    MatButtonModule,
    MatSlideToggleModule,
    FormsModule,
  ],
  templateUrl: './ip-overview.component.html',
  styleUrl: './ip-overview.component.scss',
})
export class IpOverviewComponent implements OnInit, AfterViewInit {
  ip = input<string>();
  @Input({ transform: flattenResults }) results: Array<FlattenedApiCallResult> =
    [];
  dataSource = new MatTableDataSource<FlattenedApiCallResult>();
  @ViewChild(MatSort) sort!: MatSort;
  onlyActive = false;

  displayedColumns = [
    'targetUrl',
    'appType',
    'description',
    'active',
    'actionsColumn',
  ];

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.results);
    this.dataSource.filterPredicate = (
      data: FlattenedApiCallResult,
      filter: string
    ) => data.active.toString() === filter;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  showOnlyActiveApps() {
    this.dataSource.filter = this.onlyActive ? this.onlyActive.toString() : '';
  }
}
