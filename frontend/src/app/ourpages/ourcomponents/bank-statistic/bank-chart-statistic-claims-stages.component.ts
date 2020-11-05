import {Component, OnDestroy, OnInit} from '@angular/core';
import { HttpService } from '../../../share/services/http.service';
import { Subscription } from 'rxjs';
import { TransferService } from '../../../share/services/transfer.service';
import { ErrorService } from '../../../share/services/error.service';

@Component({
    selector: 'app-bank-chart-statistic-claims-stages',
    templateUrl: './bank-chart-statistic-claims-stages.component.html',
})
export class BankStatisticClaimsByStagesComponent implements OnInit, OnDestroy {
   
    role: string;
    doughnutChartLabels: any;
    doughnutChartData: any;
    is_data_ready = false;
    bankId: string;

    constructor(private transferService: TransferService,
      private httpServise: HttpService, private errorService: ErrorService) {
    }

    subscription1: Subscription = new Subscription();

    ngOnInit(): void {
      this.role = localStorage.getItem('role');
      this.bankId = this.transferService.bankID.getValue();

      this.doughnutChartData = [ { data: [] } ];
      this.doughnutChartLabels = [];
      this.loadCountClaimsByStages();
    }

    loadCountClaimsByStages(){
      this.subscription1 = this.httpServise.getCountClaimsByStages().subscribe({
        next: (response: any) => {  
          this.doughnutChartLabels = [
            // 'arbitration_claims',
             'chargeback_claims',
             'chargeback_escalation_claims',
            // 'closed_claims',
            // 'dispute_claims',
            // 'dispute_response_claims',
            // 'final_ruling_claims',
             'mediation_claims',
            // 'pre_arbitration_claims',
            // 'pre_arbitration_response_claims',
             'pre_mediation_claims'
          ];
          
          this.doughnutChartData  = [{
            data: [
              // response['arbitration_claims'],
               response['chargeback_claims'],
               response['chargeback_escalation_claims'],
              // response['closed_claims'],
              // response['dispute_claims'],
              // response['dispute_response_claims'],
              // response['final_ruling_claims'],
               response['mediation_claims'],
              // response['pre_arbitration_claims'],
              // response['pre_arbitration_response_claims'],
               response['pre_mediation_claims']
            ] 
          }];
        },
        error: error => {
          this.errorService.handleError(error);
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
  
