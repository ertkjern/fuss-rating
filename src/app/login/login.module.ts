import {NgModule} from '@angular/core';
import {LoginComponent} from './login.component';
import {SharedModule} from '../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {LoginRouteModule} from './login.route';


@NgModule({
  imports: [LoginRouteModule, FormsModule, ReactiveFormsModule, CommonModule, SharedModule],
  exports: [],
  declarations: [LoginComponent],
  providers: [],
})
export class LoginModule {
}
