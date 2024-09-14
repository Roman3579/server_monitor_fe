import { Component, computed, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AppInfoService } from '../../services/app-info.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-info-edit',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButton,
  ],
  templateUrl: './info-edit.component.html',
  styleUrl: './info-edit.component.scss',
})
export class InfoEditComponent {
  target = input.required<string>();
  targetWithoutEndpoint = computed(() => {
    const firstSlash = this.target().indexOf('/');
    const thirdSlash = this.target().indexOf('/', firstSlash + 2);
    return this.target().substring(0, thirdSlash);
  });

  detailsForm = this.formBuilder.group({
    appType: ['', Validators.required],
    description: ['', Validators.required],
    frontendLink: '',
  });

  constructor(
    private appInfoService: AppInfoService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  onFormSubmit() {
    this.appInfoService
      .updateAppInfo({
        appType: this.detailsForm.value.appType!,
        description: this.detailsForm.value.description!,
        frontendUrl: this.detailsForm.value.frontendLink!,
      })
      .subscribe({
        next: (res) => console.log(res),
        error: (error) => {
          console.error(error);
          this.showSnackbar(
            'An error occurred when submitting data. View console for details'
          );
        },
      });
  }

  private showSnackbar(message: string) {
    this.snackBar.open(message, 'Close', { duration: 5000 });
  }
}
