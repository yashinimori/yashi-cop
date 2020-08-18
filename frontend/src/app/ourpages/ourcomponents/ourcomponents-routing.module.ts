import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OurComponentsComponent } from './ourcomponents.component';
import { ClaimsComponent } from './claims/claims.component';
import { SingleClaimComponent } from './single-claim/single-claim.component';
import { ClaimsAnalysisComponent } from './claims-analysis/claims-analysis.component';


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
      path: 'claims-analysis',
      component: ClaimsAnalysisComponent,
    }

  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OurComponentsRoutingModule {
}
