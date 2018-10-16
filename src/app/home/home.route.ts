import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home.component';
import {AuthGuard} from '../shared/services/authGuard';

const HOME: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  }
];

export let HomeRouterModule = RouterModule.forChild(HOME);
