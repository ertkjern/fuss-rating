import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HomeRouterModule} from './home.route';
import {HomeComponent} from './home.component';
import {MatchmakerComponent} from './matchmaker/matchmaker.component';
import {GameSettingsComponent} from './matchmaker/game-settings/game-settings.component';
import {ScoreComponent} from './score/score.component';
import {GamesComponent} from './games/games.component';
import {HistoryComponent} from './history/history.component';
import {RouterModule} from '@angular/router';
import {RegisterMatchComponent} from './register-winner/register-match.component';
import {NgSelectModule} from '@ng-select/ng-select';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HomeRouterModule,
    NgSelectModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule
  ],
  exports: [],
  declarations: [
    HomeComponent,
    MatchmakerComponent,
    GameSettingsComponent,
    ScoreComponent,
    GamesComponent,
    RegisterMatchComponent,
    HistoryComponent],
  providers: [],
})
export class HomeModule {
}
