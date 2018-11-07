import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home.component';
import {AuthGuard} from '../shared/services/authGuard';
import {MatchmakerComponent} from './matchmaker/matchmaker.component';
import {ScoreComponent} from './score/score.component';
import {HistoryComponent} from './history/history.component';

const HOME: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: MatchmakerComponent,
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
