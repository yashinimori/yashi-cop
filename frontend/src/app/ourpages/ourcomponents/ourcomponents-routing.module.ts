import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OurComponentsComponent } from './ourcomponents.component';
import { ClaimsComponent } from './claims/claims.component';
import { SingleClaimComponent } from './single-claim/single-claim.component';
import { ATMlogUploadComponent } from './atm-log-upload/atm-log-upload.component';
import { ATMlogViewerComponent } from './atm-log-view/atm-log-view.component';
import { ATMlogViewerDetailComponent } from './atm-log-view-detail/atm-log-view-detail.component';
import { SingleClaimFormsComponent } from './single-claim-forms/single-claim-forms.component';
import { ChboDashboardComponent } from './chbo-dashboard/chbo-dashboard.component';
import { ChboMyClaimsComponent } from './chbo-my-claims/chbo-my-claims.component';
import { ChartDonatComponent } from './chart-donat/chart-donat.component';
import { HorizontalBarComponent } from './horizontal-bar/horizontal-bar.component';


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
      path: 'chbo-dashboard',
      component: ChboDashboardComponent,
    },
    {
      path: 'chbo-my-claims',
      component: ChboMyClaimsComponent,
    },
    {
      path: 'chart-donat',
      component: ChartDonatComponent,
    },
    {
      path: 'horizontal-bar',
      component: HorizontalBarComponent,
    },

    

  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OurComponentsRoutingModule {
}
