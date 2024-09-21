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
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppInfoService } from '../../services/app-info.service';
import { saveAs } from 'file-saver';
import { MatDialog } from '@angular/material/dialog';
import { LoadingDialogComponent } from '../shared/loading-dialog/loading-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStorageService } from '../../services/local-storage.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ApiError } from '../../models/api-error';

interface FlattenedApiCallResult {
  targetUrl: string;
  appType: string;
  description: string;
  error: string;
  frontendUrl: string;
}

function flattenResults(results: ApiCallResult[]) {
  return results.map((result) => {
    return <FlattenedApiCallResult>{
      targetUrl: result.targetUrl,
      appType: result.appInfoModel?.appType,
      description: result.appInfoModel?.description,
      error: result.errorMessage,
      frontendUrl: result.appInfoModel?.frontendUrl,
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
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
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
  expanded = true;

  displayedColumns = [
    'targetUrl',
    'appType',
    'description',
    'active',
    'actionsColumn',
  ];

  filterSelection = new FormControl<string[]>([]);
  filterOptions = [
    { displayValue: 'Active', value: undefined },
    { displayValue: 'Unreachable - live', value: ApiError.NOT_FOUND },
    { displayValue: 'Unreachable - dead', value: ApiError.CONNECTION_FAILED },
    { displayValue: 'Unknown', value: ApiError.UNKNOWN_ERROR },
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
    ) => {
      const selection: (string | null)[] = JSON.parse(filter);
      if (data.error == undefined && selection.includes(null)) {
        return true;
      }
      return selection.length === 0 ? true : selection.includes(data.error);
    };
    this.expanded = !this.localStorageService
      .retrieveCollapsedIpViews()
      .includes(this.ip());
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  updateActivityFilter() {
    this.dataSource.filter = JSON.stringify(this.filterSelection.value);
  }

  getStatusColor(errorMessage?: ApiError) {
    if (errorMessage == null || errorMessage == undefined) {
      return 'success';
    } else if (errorMessage.includes('Connection failed')) {
      return 'warn';
    } else if (errorMessage.includes('Not found')) {
      return 'accent';
    }
    return 'primary';
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

  toggleExpansion() {
    this.expanded = !this.expanded;
    this.expanded
      ? this.localStorageService.removeFromCollapsedViews(this.ip())
      : this.localStorageService.addToCollapsedViews(this.ip());
  }
}
