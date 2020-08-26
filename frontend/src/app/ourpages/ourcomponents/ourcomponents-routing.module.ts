import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OurComponentsComponent } from './ourcomponents.component';
import { ClaimsComponent } from './claims/claims.component';
import { SingleClaimComponent } from './single-claim/single-claim.component';
import { ATMlogUploadComponent } from './atm-log-upload/atm-log-upload.component';
import { ATMlogViewerComponent } from './atm-log-view/atm-log-view.component';
import { ATMlogViewerDetailComponent } from './atm-log-view-detail/atm-log-view-detail.component';
import { SingleClaimFormsComponent } from './single-claim-forms/single-claim-forms.component';
import { BankUserComponent } from './bank-user/bank-user.component';
import { MerchUserComponent } from './merch-user/merch-user.component';
import { BankComponent } from './bank/bank.component';

const routes: Routes = [{
  path: '',
  component: OurComponentsComponent,
  children: [
    {
      path: 'claims',
      component: ClaimsComponent,
    },
    {
      path: 'single-claim',
      component: SingleClaimComponent,
    },
    {
      path: 'atm-log-upload',
      component: ATMlogUploadComponent,
    },
    {
      path: 'atm-log-view',
      component: ATMlogViewerComponent,
    },
    {
      path: 'atm-log-view-detail',
      component: ATMlogViewerDetailComponent,
    },
    {
      path: 'single-claim-forms',
      component: SingleClaimFormsComponent,
    },
    {
      path: 'bank-user',
      component: BankUserComponent,
    },
    {
      path: 'merch-user',
      component: MerchUserComponent,
    },
    {
      path: 'bank',
      component: BankComponent,
    },


    

  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OurComponentsRoutingModule {
}
