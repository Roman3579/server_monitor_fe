import {NgClass} from '@angular/common';
import {AfterViewInit, Component, Input, input, OnInit, ViewChild,} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterLink} from '@angular/router';
import {ApiCallResult} from '../../models/api-call-result';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';
import {AppInfoService} from '../../services/app-info.service';
import {saveAs} from 'file-saver';
import {MatDialog} from '@angular/material/dialog';
import {LoadingDialogComponent} from '../shared/loading-dialog/loading-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LocalStorageService} from '../../services/local-storage.service';
import {ApiCallError} from "../../models/api-call-error";
import {ArgumentOutOfRangeError} from "rxjs";

interface FlattenedApiCallResult {
  targetUrl: string;
  appType: string;
  description: string;
  error: ApiCallError;
  frontendUrl: string;
}

function flattenResults(results: ApiCallResult[]) {
  return results.map((result) => {
    return <FlattenedApiCallResult>{
      targetUrl: result.targetUrl,
      appType: result.appInfoModel.appType,
      description: result.appInfoModel.description,
      error: result.appInfoModel.apiCallError,
      frontendUrl: result.appInfoModel.frontendUrl,
    };
  });
}

@Component({
  selector: 'app-ip-overview',
  standalone: true,
  imports: [
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
  ip = input.required<string>();
  @Input({ transform: flattenResults }) results: Array<FlattenedApiCallResult> =
    [];
  dataSource = new MatTableDataSource<FlattenedApiCallResult>();
  @ViewChild(MatSort) sort!: MatSort;
  onlyActive = false;
  expanded = true;

  displayedColumns = [
    'targetUrl',
    'appType',
    'description',
    'active',
    'actionsColumn',
  ];

  constructor(
    private appInfoService: AppInfoService,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.results);
    this.dataSource.filterPredicate = (
      data: FlattenedApiCallResult,
      filter: string
    ) => data.active.toString() === filter;
    this.expanded = !this.localStorageService
      .retrieveCollapsedIpViews()
      .includes(this.ip());
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  showOnlyActiveApps() {
    this.dataSource.filter = this.onlyActive ? this.onlyActive.toString() : '';
  }

  downloadLatestLogs(url: string) {
    const dialogRef = this.dialog.open(LoadingDialogComponent, {
      data: { title: 'Downloading logs...' },
    });
    const urlOrigin = this.appInfoService.extractOrigin(url);
    const filename = `${urlOrigin}_logs.txt`;
    this.appInfoService.downloadAppLogs(urlOrigin).subscribe({
      next: (res) => {
        saveAs(res, filename);
        dialogRef.close();
      },
      error: (err) => {
        console.log(err);
        this.snackBar.open('Failed to download logs. See console for details.');
        dialogRef.close();
      },
    });
  }

  getStatusColor(errorValue?: ApiCallError) {
    switch (errorValue){
      case null:
        return "success"
      case ApiCallError.NOT_FOUND:
        return "accent"
      case ApiCallError.CONNECTION_ERROR:
        return "warn"
      case ApiCallError.UNKNOWN:
        return "primary"
      default:
        throw new ArgumentOutOfRangeError()
    }
  }

  toggleExpansion() {
    this.expanded = !this.expanded;
    this.expanded
      ? this.localStorageService.removeFromCollapsedViews(this.ip())
      : this.localStorageService.addToCollapsedViews(this.ip());
  }
}
