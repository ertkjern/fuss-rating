import {Routes, RouterModule} from '@angular/router';

import {LoginComponent} from './login.component';

const LOGIN: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  }
];

export let LoginRouteModule = RouterModule.forChild(LOGIN);
