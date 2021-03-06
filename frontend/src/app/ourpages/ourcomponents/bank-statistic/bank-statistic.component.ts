import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { TransferService } from '../../../share/services/transfer.service';
import { HttpService } from '../../../share/services/http.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorService } from '../../../share/services/error.service';

@Component({
  selector: 'ngx-bank-statistic',
  templateUrl: './bank-statistic.component.html',
  styleUrls: ['./bank-statistic.component.scss']
})
export class BankStatisticComponent implements OnInit, OnDestroy {
  role: string;
  //1
  b1_new_claims: any;
  b1_attend_to_claims: any;
  b4_active_bank_users: any;

  //2
  b2_pre_mediation_claims: any;
  b2_mediation_claims: any;
  b2_chargeback_claims: any;
  b2_chargeback_escalation_claims: any;
  b2_dispute_claims: any;
  b2_dispute_response_claims: any;
  b2_pre_arbitration_claims: any;
  b2_pre_arbitration_response_claims: any;
  b2_arbitration_claims: any;
  b2_final_ruling_claims: any;
  b2_closed_claims: any;
  //3
  b3_fraud_claims: any;
  b3_authorization_claims: any;
  b3_point_of_interaction_error_claims: any;
  b3_cardholder_disputes_claims: any;
  //4
  
  //5
  b5_pre_mediation_claims: any;
  b5_mediation_claims: any;
  b5_chargeback_claims: any;
  b5_chargeback_escalation_claims: any;
  b5_dispute_claims: any;
  b5_dispute_response_claims: any;
  b5_pre_arbitration_claims: any;
  b5_pre_arbitration_response_claims: any;
  b5_arbitration_claims: any;
  b5_final_ruling_claims: any;
  b5_closed_claims: any;
  //6
  b6_fraud_claims: any;
  b6_authorization_claims: any;
  b6_point_of_interaction_error_claims: any;
  b6_cardholder_disputes_claims: any;
  
  bankID: string;

  constructor(private transferService: TransferService,
    private router: Router,
    private httpServise: HttpService, private errorService: ErrorService) {
    
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler($event) {
    if (this.bankID) {
      localStorage.setItem('bankID', this.bankID);
    }
  }
  
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  subscription3: Subscription = new Subscription();
  subscription4: Subscription = new Subscription();
  subscription5: Subscription = new Subscription();

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    if(localStorage.getItem('bankID')) {
      this.bankID = localStorage.getItem('bankID');
    } else {
      this.bankID = this.transferService.bankID.getValue();
    }

    this.loadCountNewClaims();
    this.loadBankCountNewClaims(this.bankID);

    //this.loadCountClaimsByStages();
    // this.loadCountClaimsByRcGroup();
    // this.loadBankCountUpdatedClaims("1");
    // this.loadCountUpdatedClaims();
    // this.loadCountClaimsBySupport();
  }

  ngOnDestroy(): void{ 
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    this.subscription4.unsubscribe();
    this.subscription5.unsubscribe();
  }

  loadBankCountUpdatedClaims(bankId: string){
    this.subscription1 = this.httpServise.getBankCountUpdatedClaims(bankId).subscribe({
      next: (response: any) => { 
      },
      error: error => {
        this.errorService.handleError(error);
        console.error('There was an error!', error);
      },
      complete: () => {
      }
    });
  }

  loadBankCountNewClaims(bankId: string){
    this.subscription2 = this.httpServise.getBankCountNewClaims(bankId).subscribe({
      next: (response: any) => {
        this.b4_active_bank_users = response['active_bank_users'];
      },
      error: error => {
        this.errorService.handleError(error);
        console.error('There was an error!', error);
      },
      complete: () => {
      }
    });
  }

  loadCountUpdatedClaims(){
    this.subscription3 = this.httpServise.getCountUpdatedClaims().subscribe({
      next: (response: any) => {
      },
      error: error => {
        this.errorService.handleError(error);
        console.error('There was an error!', error);
      },
      complete: () => {
      }
    });
  }

  loadCountNewClaims(){
    this.subscription4 = this.httpServise.getCountNewClaims().subscribe({
      next: (response: any) => {
        this.b1_new_claims = response['new_claims'];
        this.b1_attend_to_claims = response['attend_to_claims'];
      },
      error: error => {
        this.errorService.handleError(error);
        console.error('There was an error!', error);
      },
      complete: () => {
      }
    });
  }

  
  // loadCountClaimsByStages(){
  //   this.httpServise.getCountClaimsByStages().subscribe({
  //     next: (response: any) => {
  //       // this.b2_arbitration_claims = response['arbitration_claims'];
  //       // this.b2_chargeback_claims = response['chargeback_claims'];
  //       // this.b2_chargeback_escalation_claims = response['chargeback_escalation_claims'];
  //       // this.b2_closed_claims = response['closed_claims'];
  //       // this.b2_dispute_claims = response['dispute_claims'];
  //       // this.b2_dispute_response_claims = response['dispute_response_claims'];
  //       // this.b2_final_ruling_claims = response['final_ruling_claims'];
  //       // this.b2_mediation_claims = response['mediation_claims'];
  //       // this.b2_pre_arbitration_claims = response['pre_arbitration_claims'];
  //       // this.b2_pre_arbitration_response_claims = response['pre_arbitration_response_claims'];
  //       // this.b2_pre_mediation_claims = response['pre_mediation_claims'];

  //       let data = new DoughnutTransfer();
  //       data.chartLabels = [
  //         'arbitration_claims',
  //         'chargeback_claims',
  //         'chargeback_escalation_claims',
  //         'closed_claims',
  //         'dispute_claims',
  //         'dispute_response_claims',
  //         'final_ruling_claims',
  //         'mediation_claims',
  //         'pre_arbitration_claims',
  //         'pre_arbitration_response_claims',
  //         'pre_mediation_claims'
  //       ];
  //       data.chartType = 'doughnut';
  //       data.chartData  = [
  //         response['arbitration_claims'],
  //         response['chargeback_claims'],
  //         response['chargeback_escalation_claims'],
  //         response['closed_claims'],
  //         response['dispute_claims'],
  //         response['dispute_response_claims'],
  //         response['final_ruling_claims'],
  //         response['mediation_claims'],
  //         response['pre_arbitration_claims'],
  //         response['pre_arbitration_response_claims'],
  //         response['pre_mediation_claims']
  //       ];
  //       data.colours = ["rgba(0, 108, 112, 1)",
  //           "rgba(224, 224, 0, 1)",
  //           "rgba(224, 0, 112, 1)",
  //           "rgba(224, 50, 37, 1)",
  //           "rgba(51, 70, 0, 1)",
  //           "rgba(224, 224, 0, 1)",
  //           "rgba(224, 0, 112, 1)",
  //           "rgba(224, 50, 37, 1)",
  //           "rgba(51, 70, 0, 1)",
  //           "rgba(224, 224, 0, 1)",
  //           "rgba(224, 0, 112, 1)",
  //           "rgba(224, 50, 37, 1)",
  //           "rgba(51, 70, 0, 1)"
  //         ];
  //       this.transferService.claimsByStages.next(data);

  //     },
  //     error: error => {
  //       console.error('There was an error!', error);
  //     },
  //     complete: () => {
       
  //     }
  //   });

  // }

  
  // loadCountClaimsByRcGroup(){
  //   this.httpServise.getCountClaimsByRcGroup().subscribe({
  //     next: (response: any) => {

  //       this.b3_fraud_claims = response['fraud_claims'];
  //       this.b3_authorization_claims = response['authorization_claims'];
  //       this.b3_point_of_interaction_error_claims = response['point_of_interaction_error_claims'];
  //       this.b3_cardholder_disputes_claims = response['cardholder_disputes_claims'];


  //       let data = new DoughnutTransfer();
  //       data.chartLabels = [
  //         'fraud_claims',
  //         'authorization_claims',
  //         'point_of_interaction_error_claims',
  //         'cardholder_disputes_claims'
  //         ];
  //       data.chartType = 'doughnut';
  //       data.chartData  = [
  //         response['fraud_claims'],
  //         response['authorization_claims'],
  //         response['point_of_interaction_error_claims'],
  //         response['cardholder_disputes_claims'],
  //       ];
  //       data.colours = ["rgba(0, 108, 112, 1)",
  //           "rgba(224, 224, 0, 1)",
  //           "rgba(224, 0, 112, 1)",
  //           "rgba(224, 50, 37, 1)",
  //         ]
  //       this.transferService.claimsByRcGroup.next(data);

  //     },
  //     error: error => {
  //       console.error('There was an error!', error);
  //     },
  //     complete: () => {
       
  //     }
  //   });

  // }

  loadCountClaimsBySupport(){
    this.subscription5 = this.httpServise.getCountClaimsBySupport().subscribe({
      next: (response: any) => {
      },
      error: error => {
        this.errorService.handleError(error);
        console.error('There was an error!', error);
      },
      complete: () => {  
      }
    });
  }

  goBack(){
    this.transferService.bankID.next(this.bankID);
    if(this.role=='cop_manager')
      this.router.navigate(['cop', 'cabinet', 'bank-single']);
    else if(this.role=='top_level')
      this.router.navigate(['cop', 'cabinet', 'top-officer']);
    else
      this.router.navigate(['cop', 'cabinet']);
  }


}
