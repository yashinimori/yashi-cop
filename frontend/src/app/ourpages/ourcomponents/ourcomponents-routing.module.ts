import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OurComponentsComponent } from './ourcomponents.component';
import { ClaimsComponent } from './claims/claims.component';
import { SingleClaimComponent } from './single-claim/single-claim.component';
import { ATMlogUploadComponent } from './atm-log-upload/atm-log-upload.component';
import { ATMlogViewerComponent } from './atm-log-view/atm-log-view.component';

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
    }

  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OurComponentsRoutingModule {
}
