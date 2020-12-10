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
import { BankUserComponent } from './bank-user/bank-user.component';
import { MerchUserComponent } from './merch-user/merch-user.component';
import { BankComponent } from './bank/bank.component';
import { BankListComponent } from './bank-list/bank-list.component';
import { BankSingleComponent } from './bank-single/bank-single.component';
import { TopOfficerComponent } from './top-officer/top-officer.component';
import { SecurOfficerComponent } from './secur-officer/secur-officer.component';
import { SecurOfficerUserComponent } from './secur-officer-user/secur-officer-user.component';
import { StatisticComponent } from './statistic/statistic.component';
import { BankStatisticComponent } from './bank-statistic/bank-statistic.component';
import { ATMComponent } from './atm/atm.component';
import { TutorialPageComponent } from './tutorial-page/tutorial-page.component';
import { ChangeUserInfoComponent } from './change-user-info/change-user-info.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { EditAtmComponent } from './bank-single/edit/edit-atm/edit-atm.component';
import { EditMerchantComponent } from './bank-single/edit/edit-merchant/edit-merchant.component';
import { EditBankUserComponent } from './bank-single/edit/edit-bank-user/edit-bank-user.component';
import { TransactionSearchComponent } from './mastercard-menu/transaction-search/transaction-search.component';
import { MastercardChargebacksComponent } from './mastercard-menu/mastercard-chargebacks/mastercard-chargebacks.component';
import { MastercardFeesComponent } from './mastercard-menu/mastercard-fees/mastercard-fees.component';
import { MastercardRetrievalComponent } from './mastercard-menu/mastercard-retrieval/mastercard-retrieval.component';
import { BankAccountsComponent } from './bank-accounts/bank-accounts.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { TransactionsInfoComponent } from './transactions-info/transactions-info.component';

const routes: Routes = [{
  path: '',
  component: OurComponentsComponent,
  children: [
    {
      path: 'change-user-info',
      component: ChangeUserInfoComponent,
    },
    {
      path: 'register/:status',
      component: RegisterUserComponent,
    },
    {
      path: 'claims',
      component: ClaimsComponent,
    },
    {
       path: 'claims/all',
       component: ClaimsComponent,
    },
    {
      path: 'claims/archive',
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
      path: 'chbo-my-claims/:status',
      component: ChboMyClaimsComponent,
    },
    {
      path: 'chart-donat',
      component: ChartDonatComponent,
    },
    {
      path: 'chartss',
      component: ChartDonatComponent,
    },
    {
      path: 'horizontal-bar',
      component: HorizontalBarComponent,
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
    {
      path: 'bank-list',
      component: BankListComponent,
    },
    {
      path: 'bank-single',
      component: BankSingleComponent,
    },
    {
      path: 'edit-atm',
      component: EditAtmComponent,
    },
    {
      path: 'edit-bank-user',
      component: EditBankUserComponent,
    },
    {
      path: 'edit-merchant',
      component: EditMerchantComponent,
    },
    {
      path: 'top-officer/:status',
      component: TopOfficerComponent,
    },
    {
      path: 'bank-accounts',
      component: BankAccountsComponent,
    },
    {
      path: 'transactions',
      component: TransactionsComponent,
    },
    {
      path: 'transaction-info',
      component: TransactionsInfoComponent,
    },
    {
      path: 'secur-officer',
      component: SecurOfficerComponent,
    },
    {
      path: 'secur-officer-user',
      component: SecurOfficerUserComponent,
    },
    {
      path: 'statistic',
      component: StatisticComponent,
    },
    {
      path: 'bank-statistic',
      component: BankStatisticComponent,
    },
    {
      path: 'atm',
      component: ATMComponent,
    },
    {
      path: 'tutorials',
      component: TutorialPageComponent
    },
    {
      path: 'mastercard-transaction-search',
      component: TransactionSearchComponent
    },
    {
      path: 'mastercard-chargebacks',
      component: MastercardChargebacksComponent
    },
    {
      path: 'mastercard-retrieval',
      component: MastercardRetrievalComponent
    },
    {
      path: 'mastercard-fees',
      component: MastercardFeesComponent
    },

  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OurComponentsRoutingModule {
}
