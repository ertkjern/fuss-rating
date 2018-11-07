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


@NgModule({
  imports: [
    HomeRouterModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule
  ],
  exports: [],
  declarations: [
    HomeComponent,
    MatchmakerComponent,
    GameSettingsComponent,
    ScoreComponent,
    GamesComponent,
    HistoryComponent],
  providers: [],
})
export class HomeModule {
}
