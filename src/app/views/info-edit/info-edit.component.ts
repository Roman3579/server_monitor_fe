import { Component, computed, DestroyRef, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { AppInfoService } from '../../services/app-info.service';
import { LoadingDialogComponent } from '../shared/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-info-edit',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './info-edit.component.html',
  styleUrl: './info-edit.component.scss',
})
export class InfoEditComponent {
  target = input.required<string>();
  targetWithoutEndpoint = computed(() => {
    try {
      return this.appInfoService.extractOrigin(this.target());
    } catch (error) {
      console.warn(`Failed to extract origin from ${this.target()}`);
      return 'unknown';
    }
  });

  detailsForm = this.formBuilder.group({
    appType: ['', Validators.required],
    description: ['', Validators.required],
    frontendLink: '',
  });

  constructor(
    private appInfoService: AppInfoService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private destroyRef: DestroyRef,
    private dialog: MatDialog
  ) {}

  onFormSubmit() {
    this.dialog.open(LoadingDialogComponent, {data: {title: "Sending data..."}});
    const submissionSubscription = this.appInfoService
      .updateAppInfo({
        appType: this.detailsForm.value.appType!,
        description: this.detailsForm.value.description!,
        frontendUrl: this.detailsForm.value.frontendLink!,
      })
      .subscribe({
        next: () => {
          this.dialog.closeAll();
          this.showSnackbar('Data updated successfully.');
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.dialog.closeAll();
          console.error(error);
          this.showSnackbar(
            'An error occurred when submitting data. View console for details'
          );
        },
      });

    this.destroyRef.onDestroy(() => {
      submissionSubscription.unsubscribe();
    });
  }

  private showSnackbar(message: string) {
    this.snackBar.open(message, 'Close', { duration: 5000 });
  }
}
