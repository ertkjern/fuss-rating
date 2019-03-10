import {NgModule} from '@angular/core';
import {HeaderComponent} from './components/header/header.component';
import {ValidationService} from './services/validation.service';
import {AuthenticationService} from './services/authentication.service';
import {AuthGuard} from './services/authGuard';
import {CommonModule} from '@angular/common';
import {UserService} from './services/user.service';
import {MatchmakerService} from './services/matchmaker.service';
import {HistoryService} from './services/history.service';
import { MatchTypeSelectorComponent } from './components/match-type-selector/match-type-selector.component';


@NgModule({
  imports: [CommonModule],
  exports: [HeaderComponent, MatchTypeSelectorComponent],
  declarations: [HeaderComponent, MatchTypeSelectorComponent],
  providers: [ValidationService, AuthenticationService, AuthGuard, UserService, MatchmakerService, HistoryService],
})
export class SharedModule {
}
