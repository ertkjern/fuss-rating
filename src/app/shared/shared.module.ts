import {NgModule} from '@angular/core';
import {HeaderComponent} from './components/header/header.component';
import {ValidationService} from './services/validation.service';
import {AuthenticationService} from './services/authentication.service';
import {AuthGuard} from './services/authGuard';
import {CommonModule} from '@angular/common';
import {UserService} from './services/user.service';
import {MatchmakerService} from './services/matchmaker.service';


@NgModule({
  imports: [CommonModule],
  exports: [HeaderComponent],
  declarations: [HeaderComponent],
  providers: [ValidationService, AuthenticationService, AuthGuard, UserService, MatchmakerService],
})
export class SharedModule {
}
