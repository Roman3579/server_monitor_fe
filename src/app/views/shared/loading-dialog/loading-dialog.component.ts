import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-dialog',
  standalone: true,
  imports: [MatDialogModule, MatProgressSpinnerModule],
  templateUrl: './loading-dialog.component.html',
  styleUrl: './loading-dialog.component.scss',
})
export class LoadingDialogComponent {}
