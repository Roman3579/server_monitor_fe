import { Routes } from '@angular/router';
import { InfoEditComponent } from './views/info-edit/info-edit.component';
import { AppsOverviewComponent } from './views/apps-overview/apps-overview.component';
import { AppDetailComponent } from './views/app-detail/app-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: AppsOverviewComponent,
  },
  {
    path: 'edit/:target',
    component: InfoEditComponent,
  },
  {
    path: 'detail/:target',
    component: AppDetailComponent,
  },
];
