import {Routes, RouterModule} from '@angular/router';

import {LoginComponent} from './login.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';

const LOGIN: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'forgotPassword',
    component: ForgotPasswordComponent
  }
];

export let LoginRouteModule = RouterModule.forChild(LOGIN);
