import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';

import { WebsiteComponent } from './website/website.component';
import { AppealsComponent } from './website/appeals/appeals.component';
import { LoginComponent } from './authorisation/login/login.component';
import { RegistrationComponent } from './authorisation/registration/registration.component';

const routes: Routes = [
   // { path: 'authorisation/login', component: LoginComponent },
  //  { path: '', redirectTo: 'authorisation/login', pathMatch: 'full'},
  //  { path: '**', redirectTo: 'authorisation/login' },  

    // {
    //   path: 'pages',
    //   loadChildren: () => import('./pages/pages.module')
    //     .then(m => m.PagesModule),
    // },
    // { path: '', redirectTo: 'pages', pathMatch: 'full' },
    // { path: '**', redirectTo: 'pages' },

    {
      path: 'ourpages',
      loadChildren: () => import('./ourpages/ourpages.module')
        .then(m => m.OurPagesModule),
    },
    {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'registration',
        component: RegistrationComponent,
      }
    ],
  },
    // {
    //   path: 'auth',
    //   loadChildren: () => import('./authorisation/authorisation.module')
    //     .then(m => m.AuthorisationModule),
    // },
    { path: '', redirectTo: 'ourpages', pathMatch: 'full' },
    { path: '**', redirectTo: 'ourpages' },

    
];


// export const routes: Routes = [
//   {
//     path: 'pages',
//     loadChildren: () => import('./pages/pages.module')
//       .then(m => m.PagesModule),
//   },
//   {
//     path: 'auth',
//     component: NbAuthComponent,
//     children: [
//       {
//         path: '',
//         component: NbLoginComponent,
//       },
//       {
//         path: 'login',
//         component: NbLoginComponent,
//       },
//       {
//         path: 'register',
//         component: NbRegisterComponent,
//       },
//       {
//         path: 'logout',
//         component: NbLogoutComponent,
//       },
//       {
//         path: 'request-password',
//         component: NbRequestPasswordComponent,
//       },
//       {
//         path: 'reset-password',
//         component: NbResetPasswordComponent,
//       },
//     ],
//   },
//   { path: '', redirectTo: 'pages', pathMatch: 'full' },
//   { path: '**', redirectTo: 'pages' },
// ];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
