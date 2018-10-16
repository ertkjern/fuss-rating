import {NgModule} from '@angular/core';
import {LoginComponent} from './login.component';
import {SharedModule} from '../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {LoginRouteModule} from './login.route';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {RouterModule} from '@angular/router';


@NgModule({
  imports: [LoginRouteModule, FormsModule, RouterModule, ReactiveFormsModule, CommonModule, SharedModule],
  exports: [],
  declarations: [LoginComponent, ForgotPasswordComponent],
  providers: [],
})
export class LoginModule {
}
