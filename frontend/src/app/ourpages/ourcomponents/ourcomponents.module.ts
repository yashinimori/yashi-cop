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
import { ChartDonatComponent } from './chart-donat/chart-donat.component';
import { HorizontalBarComponent } from './horizontal-bar/horizontal-bar.component';
import { ChartsModule } from 'ng2-charts';
import { BankUserComponent } from './bank-user/bank-user.component';
import { MerchUserComponent } from './merch-user/merch-user.component';
import { BankComponent } from './bank/bank.component';
import { BankListComponent } from './bank-list/bank-list.component';
import { BankSingleComponent } from './bank-single/bank-single.component';
import { ChartjsPieComponent } from '../../pages/charts/chartjs/chartjs-pie.component'
import { TopOfficerComponent } from './top-officer/top-officer.component';
import { SecurOfficerComponent } from './secur-officer/secur-officer.component';
import { SecurOfficerUserComponent } from './secur-officer-user/secur-officer-user.component';
import { ChartssComponent } from './chartss/chartss.component';
import { StatisticComponent } from './statistic/statistic.component';


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
    NbStepperModule,
    // ChartsModule,
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
    ChartDonatComponent,
    HorizontalBarComponent,
    BankUserComponent,
    MerchUserComponent,
    BankComponent,
    BankListComponent,
    BankSingleComponent,          
    TopOfficerComponent,    
    SecurOfficerComponent,
    SecurOfficerUserComponent,
    ChartssComponent,
    StatisticComponent,
  ],
  // providers: [
    
  // ],
})
export class OurComponentsModule { }
