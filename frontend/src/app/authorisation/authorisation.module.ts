import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthorisationComponent } from './authorisation.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';

import {
  NbActionsModule,
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule, NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbSpinnerModule,
  NbUserModule,
} from '@nebular/theme';

import {
  RECAPTCHA_LANGUAGE,
  RecaptchaModule,
  RecaptchaFormsModule,
} from 'ng-recaptcha';


import { ThemeModule } from '../@theme/theme.module';
import { PasswordComponent } from './password/password.component';
import { ActivationComponent } from './activation/activation.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    AuthorisationComponent, 
    LoginComponent, 
    RegistrationComponent,
    PasswordComponent,
    ActivationComponent,
  ],
  imports: [
    BrowserModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    ReactiveFormsModule,
    FormsModule,
    ThemeModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    NbSelectModule,
    NbSpinnerModule,
    NbIconModule,
    NbAlertModule,
    CommonModule,
  ],
  providers: [
    RecaptchaModule,
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: 'ukr',
    }
  ],

})
export class AuthorisationModule { }
