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
  NbAlertModule,
  NbAutocompleteModule,
  NbTooltipModule,
  NbSpinnerModule,
  NbPopoverModule,
  NbContextMenuModule,
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
//import { ChartjsPieComponent } from '../../pages/charts/chartjs/chartjs-pie.component'
import { TopOfficerComponent } from './top-officer/top-officer.component';
import { SecurOfficerComponent } from './secur-officer/secur-officer.component';
import { SecurOfficerUserComponent } from './secur-officer-user/secur-officer-user.component';
import { ChartssComponent } from './chartss/chartss.component';
import { StatisticComponent } from './statistic/statistic.component';
import { StatisticClaimsByStagesComponent } from './statistic/chart-statistic-claims-stages.component';
import { StatisticClaimsByRcGroupComponent } from './statistic/chart-statistic-claims-rc-group.component';
import { BankStatisticClaimsByRcGroupComponent } from './bank-statistic/bank-chart-statistic-claims-rc-group.component';
import { BankStatisticClaimsByStagesComponent } from './bank-statistic/bank-chart-statistic-claims-stages.component';
import { BankStatisticComponent } from './bank-statistic/bank-statistic.component';
import { ATMComponent } from './atm/atm.component';
import { ShowcaseDialogComponent } from './showcase-dialog/showcase-dialog.component';
import { StatisticClaimsByTimeComponent } from './statistic/chart-statistic-claims-time.component';
import { StatisticClaimsByReasonComponent } from './statistic/chart-statistic-claims-reason.component';
import { TableModule } from 'ngx-easy-table';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { TutorialPageComponent } from './tutorial-page/tutorial-page.component';
import { TutorialsDialogComponent } from './tutorial-page/tutorials-dialog/tutorials-dialog.component';
import { ChangeUserInfoComponent } from './change-user-info/change-user-info.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { EditBankUserComponent } from './bank-single/edit/edit-bank-user/edit-bank-user.component';
import { EditAtmComponent } from './bank-single/edit/edit-atm/edit-atm.component';
import { EditMerchantComponent } from './bank-single/edit/edit-merchant/edit-merchant.component';
import { TransactionSearchComponent } from './mastercard-menu/transaction-search/transaction-search.component';
import { MastercardChargebacksComponent } from './mastercard-menu/mastercard-chargebacks/mastercard-chargebacks.component';
import { MastercardRetrievalComponent } from './mastercard-menu/mastercard-retrieval/mastercard-retrieval.component';
import { MastercardFeesComponent } from './mastercard-menu/mastercard-fees/mastercard-fees.component';
import { BankAccountsComponent } from './bank-accounts/bank-accounts.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { TransactionsInfoComponent } from './transactions-info/transactions-info.component';

@NgModule({
  imports: [
    FormsModule,
    TableModule,
    ClipboardModule,
    ReactiveFormsModule,
    ThemeModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    NbStepperModule,
    NbCardModule,
    NbTooltipModule,
    NbButtonModule,
    NbSpinnerModule,
    NbPopoverModule,
    NbListModule,
    NbContextMenuModule,
    NbAccordionModule,
    NbUserModule,
    OurComponentsRoutingModule,
    NbDateFnsDateModule.forRoot({
      parseOptions: { useAdditionalWeekYearTokens: true, useAdditionalDayOfYearTokens: true },
      formatOptions: { useAdditionalWeekYearTokens: true, useAdditionalDayOfYearTokens: true },
    }),
    Ng2SmartTableModule,
    NbDatepickerModule, 
    NbIconModule,
    NbSelectModule,
    NbAlertModule,
    NbRadioModule,
    NbInputModule,
    ChartsModule,
    NbStepperModule,
    // ChartsModule,
    NbAutocompleteModule,
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
    StatisticClaimsByStagesComponent,
    StatisticClaimsByRcGroupComponent,
    StatisticClaimsByTimeComponent,
    StatisticClaimsByReasonComponent,
    BankStatisticComponent,
    BankStatisticClaimsByRcGroupComponent,
    BankStatisticClaimsByStagesComponent,
    ATMComponent,
    ShowcaseDialogComponent,
    TutorialPageComponent,
    TutorialsDialogComponent,
    ChangeUserInfoComponent,
    RegisterUserComponent,
    EditBankUserComponent,
    EditAtmComponent,
    EditMerchantComponent,
    TransactionSearchComponent,
    MastercardChargebacksComponent,
    MastercardRetrievalComponent,
    MastercardFeesComponent,
    BankAccountsComponent,
    TransactionsComponent,
    TransactionsInfoComponent,
  ],
  // providers: [
    
  // ],
})
export class OurComponentsModule { }
