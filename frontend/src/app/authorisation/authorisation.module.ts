import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorisationComponent } from './authorisation.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { Routes, RouterModule } from '@angular/router';

const childrens = [
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent}
];

export const routes: Routes = [
  {path: 'auth', redirectTo: 'auth/login', pathMatch: 'full'},
  {path: 'auth', component: AuthorisationComponent, children: childrens},
];


@NgModule({
  declarations: [AuthorisationComponent, LoginComponent, RegistrationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthorisationModule { }
