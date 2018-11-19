import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home.component';
import {AuthGuard} from '../shared/services/authGuard';
import {ScoreComponent} from './score/score.component';
import {HistoryComponent} from './history/history.component';
import {RegisterMatchComponent} from './register-winner/register-match.component';

const HOME: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: RegisterMatchComponent,
      },
      {
        path: 'leader-board',
        component: ScoreComponent,
      },
      {
        path: 'history',
        component: HistoryComponent
      }
    ]
  }
];

export let HomeRouterModule = RouterModule.forChild(HOME);
