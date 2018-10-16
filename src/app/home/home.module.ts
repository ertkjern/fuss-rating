import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HomeRouterModule} from './home.route';
import {HomeComponent} from './home.component';
import {MatchmakerComponent} from './matchmaker/matchmaker.component';
import {GameSettingsComponent} from './matchmaker/game-settings/game-settings.component';


@NgModule({
  imports: [HomeRouterModule, FormsModule, ReactiveFormsModule, CommonModule, SharedModule],
  exports: [],
  declarations: [HomeComponent, MatchmakerComponent, GameSettingsComponent],
  providers: [],
})
export class HomeModule {
}
