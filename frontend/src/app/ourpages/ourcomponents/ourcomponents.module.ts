import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbAccordionModule,
  NbButtonModule,
  NbCardModule,
  NbListModule,
  NbRouteTabsetModule,
  NbStepperModule,
  NbTabsetModule, 
  NbUserModule,
  NbDatepickerModule, 
  NbIconModule,
  NbSelectModule,
  NbRadioModule,
  NbInputModule,
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { OurComponentsRoutingModule } from './ourcomponents-routing.module';
import { OurComponentsComponent } from './ourcomponents.component';
import { ClaimsComponent } from './claims/claims.component';
import { SingleClaimComponent } from './single-claim/single-claim.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ATMlogUploadComponent } from './atm-log-upload/atm-log-upload.component';
import { ATMlogViewerComponent } from './atm-log-view/atm-log-view.component';
import { ATMlogViewerDetailComponent } from './atm-log-view-detail/atm-log-view-detail.component';
import { SingleClaimFormsComponent } from './single-claim-forms/single-claim-forms.component';
import { ChboDashboardComponent } from './chbo-dashboard/chbo-dashboard.component';
import { ChboMyClaimsComponent } from './chbo-my-claims/chbo-my-claims.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    NbStepperModule,
    NbCardModule,
    NbButtonModule,
    NbListModule,
    NbAccordionModule,
    NbUserModule,
    OurComponentsRoutingModule,
    Ng2SmartTableModule,
    NbDatepickerModule, 
    NbIconModule,
    NbSelectModule,
    NbRadioModule,
    NbInputModule,
    ChartsModule,
  ],
  declarations: [
    OurComponentsComponent,
    ClaimsComponent,
    SingleClaimComponent,
    ATMlogUploadComponent,
    ATMlogViewerComponent,
    ATMlogViewerDetailComponent,
    SingleClaimFormsComponent,
    ChboDashboardComponent,
    ChboMyClaimsComponent,
  ],
  // providers: [
    
  // ],
})
export class OurComponentsModule { }
