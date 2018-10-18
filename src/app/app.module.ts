import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {LoginModule} from './login/login.module';
import {SharedModule} from './shared/shared.module';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {HomeModule} from './home/home.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {MAT_DATE_LOCALE} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    LoginModule,
    BrowserAnimationsModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'nb'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
