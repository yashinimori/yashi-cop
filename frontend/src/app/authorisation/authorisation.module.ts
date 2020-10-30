import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthorisationComponent } from './authorisation.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { Routes, RouterModule } from '@angular/router';


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
  NbUserModule,
} from '@nebular/theme';

import {
  RECAPTCHA_LANGUAGE,
  RecaptchaModule,
  RecaptchaFormsModule,
  RecaptchaLoaderService
} from 'ng-recaptcha';


import { ThemeModule } from '../@theme/theme.module';
import { PasswordComponent } from './password/password.component';
import { ActivationComponent } from './activation/activation.component';
import { BrowserModule } from '@angular/platform-browser';

// const childrens = [
//   {path: 'login', component: LoginComponent},
//   {path: 'registration', component: RegistrationComponent}
// ];

// export const routes: Routes = [
//   {path: 'auth', redirectTo: 'auth/login', pathMatch: 'full'},
//   {path: 'auth', component: AuthorisationComponent, children: childrens},
// ];

// const routes: Routes = [{
//   path: '',
//   component: AuthorisationComponent,
//   children: [
//     {
//       path: 'login',
//       component: LoginComponent,
//     },
//     {
//       path: 'registration',
//       component: RegistrationComponent,
//     },
    
//   ],
// }];

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
    NbIconModule,
    NbAlertModule,
    CommonModule,
    
    // RouterModule.forChild(routes)
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
