import {Component, OnDestroy, OnInit} from '@angular/core';
import { HttpService } from '../../../share/services/http.service';
import { Subscription } from 'rxjs';
import { TransferService } from '../../../share/services/transfer.service';

@Component({
    selector: 'app-bank-chart-statistic-claims-rc-group',
    templateUrl: './bank-chart-statistic-claims-rc-group.component.html',
})
export class BankStatisticClaimsByRcGroupComponent implements OnInit, OnDestroy {
   
    role: string;
    doughnutChartLabels: any;
    doughnutChartData: any;
    is_data_ready = false;
    bankId: string;

    constructor(private transferService: TransferService,
      private httpServise: HttpService) {
    }
    subscription1: Subscription = new Subscription();

    ngOnInit(): void {
      this.role = localStorage.getItem('role');
      this.bankId = this.transferService.bankID.getValue();
      this.doughnutChartData = [ { data: [] } ];
      this.doughnutChartLabels = [];
      this.loadCountClaimsByRcGroup();
    }

    loadCountClaimsByRcGroup(){
      this.subscription1 = this.httpServise.getCountClaimsByRcGroup().subscribe({
        next: (response: any) => {
          this.doughnutChartLabels = [
            'fraud_claims',
            'authorization_claims',
            'point_of_interaction_error_claims',
            'cardholder_disputes_claims'
            ];

          this.doughnutChartData = [{
            data: [
              response['fraud_claims'],
              response['authorization_claims'],
              response['point_of_interaction_error_claims'],
              response['cardholder_disputes_claims'],
            ]
          }];
        },
        error: error => {
          console.error('There was an error!', error);
        },
        complete: () => { 
        }
      });
    }  
    
  ngOnDestroy() {
    this.subscription1.unsubscribe();
  }
}
  
