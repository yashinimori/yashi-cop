import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';
import { ClaimView } from '../../../share/models/claim-view.model';
import { DatePipe } from '@angular/common';
import { TransferService } from '../../../share/services/transfer.service';
import { HttpService } from '../../../share/services/http.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Bank } from '../../../share/models/bank.model';

@Component({
  selector: 'ngx-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit, OnDestroy {
  role: string;
  //1
  b1_new_claims: any;
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
  b4_attend_to_claims: any;
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




  constructor(private datePipe: DatePipe, 
    private transferService: TransferService,
    private router: Router,
    private httpServise: HttpService) {
    
  }

  ngOnInit(): void {
    
    this.role = localStorage.getItem('role');
    //console.log('StatisticComponent role ' +this.role);

    this.loadCountNewClaims();
    this.loadCountClaimsByStages();
    this.loadCountClaimsByRcGroup();


    // this.loadBankCountUpdatedClaims("1");
    // this.loadBankCountNewClaims("1");
    // this.loadCountUpdatedClaims();
       
     
    // this.loadCountClaimsBySupport();

  }

  ngOnDestroy(): void{ }

  loadBankCountUpdatedClaims(bankId: string){
    //console.log('loadCountUpdatedClaims(bankId: string)');
    this.httpServise.getBankCountUpdatedClaims(bankId).subscribe({
      next: (response: any) => {
        
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
       
      }
    });

  }

  loadBankCountNewClaims(bankId: string){
    //console.log('loadCountNewClaims(bankId: string)');
    this.httpServise.getBankCountNewClaims(bankId).subscribe({
      next: (response: any) => {
        //console.log(response);
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
       
      }
    });

  }


  loadCountUpdatedClaims(){
    //console.log('loadCountUpdatedClaims()');
    this.httpServise.getCountUpdatedClaims().subscribe({
      next: (response: any) => {
        //console.log(response);
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
       
      }
    });

  }

  loadCountNewClaims(){
    //console.log('loadCountNewClaims()');
    this.httpServise.getCountNewClaims().subscribe({
      next: (response: any) => {
        //console.log('loadCountNewClaims() !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        //console.log(response);
        this.b1_new_claims = response['new_claims'];
        this.b4_attend_to_claims = response['attend_to_claims'];
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
       
      }
    });

  }

  
  loadCountClaimsByStages(){
    //console.log('getCountClaimsByStages()');
    this.httpServise.getCountClaimsByStages().subscribe({
      next: (response: any) => {
        //console.log('getCountClaimsByStages()!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        //console.log(response);
        // console.log("BLA");
        // console.log("BLAAA" + response['pre_mediation_claims']);

        this.b2_arbitration_claims = response['arbitration_claims'];
        this.b2_chargeback_claims = response['chargeback_claims'];
        this.b2_chargeback_escalation_claims = response['chargeback_escalation_claims'];
        this.b2_closed_claims = response['closed_claims'];
        this.b2_dispute_claims = response['dispute_claims'];
        this.b2_dispute_response_claims = response['dispute_response_claims'];
        this.b2_final_ruling_claims = response['final_ruling_claims'];
        this.b2_mediation_claims = response['mediation_claims'];
        this.b2_pre_arbitration_claims = response['pre_arbitration_claims'];
        this.b2_pre_arbitration_response_claims = response['pre_arbitration_response_claims'];
        this.b2_pre_mediation_claims = response['pre_mediation_claims'];

      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
       
      }
    });

  }

  
  loadCountClaimsByRcGroup(){
    //console.log('getCountClaimsByRcGroup()');
    this.httpServise.getCountClaimsByRcGroup().subscribe({
      next: (response: any) => {
        //console.log(response);

        this.b3_fraud_claims = response['fraud_claims'];
        this.b3_authorization_claims = response['authorization_claims'];
        this.b3_point_of_interaction_error_claims = response['point_of_interaction_error_claims'];
        this.b3_cardholder_disputes_claims = response['cardholder_disputes_claims'];

      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
       
      }
    });

  }

  loadCountClaimsBySupport(){
    //console.log('getCountClaimsBySupport()');
    this.httpServise.getCountClaimsBySupport().subscribe({
      next: (response: any) => {
        //console.log(response);
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
       
      }
    });

  }



}
