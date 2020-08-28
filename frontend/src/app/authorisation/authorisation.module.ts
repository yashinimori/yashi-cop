import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthorisationComponent } from './authorisation.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { Routes, RouterModule } from '@angular/router';


import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule, NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbUserModule,
} from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PasswordComponent } from './password/password.component';

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
  ],
  imports: [

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

    CommonModule,
    // RouterModule.forChild(routes)
  ]
})
export class AuthorisationModule { }
