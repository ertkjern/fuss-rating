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


@NgModule({
  imports: [HomeRouterModule, FormsModule, ReactiveFormsModule, CommonModule, SharedModule],
  exports: [],
  declarations: [HomeComponent, MatchmakerComponent, GameSettingsComponent, ScoreComponent, GamesComponent],
  providers: [],
})
export class HomeModule {
}
