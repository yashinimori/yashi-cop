import {Component, OnInit} from '@angular/core'
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import { ClaimView } from '../../../share/models/claim-view.model';
import { HttpService } from '../../../share/services/http.service';
import { Subscription } from 'rxjs';
import { LocalDataSource } from 'ng2-smart-table';
import { DatePipe } from '@angular/common';
import { TransferService } from '../../../share/services/transfer.service';
import { DoughnutTransfer } from '../../../share/models/doughnut.transfer.model';

@Component({
    selector: 'app-chart-statistic-claims-stages',
    templateUrl: './chart-statistic-claims-stages.component.html',
})
export class StatisticClaimsByStagesComponent implements OnInit {
   
    role: string;
    doughnutChartLabels: any;
    doughnutChartData: any;
    is_data_ready = false;

    

    constructor(private transferService: TransferService,
      private httpServise: HttpService) {
    }

    ngOnInit(): void {
      
      this.role = localStorage.getItem('role');

      //   console.log('transferService.claimsByStages.getValue()');
      //   let data = this.transferService.claimsByStages.getValue();
      //   console.log(data);

      this.doughnutChartData = [ { data: [] } ];
      this.doughnutChartLabels = [];
      this.loadCountClaimsByStages();
      
      
      
    }


    loadCountClaimsByStages(){
      console.log('getCountClaimsByStages()');
      this.httpServise.getCountClaimsByStages().subscribe({
        next: (response: any) => {
          //console.log('getCountClaimsByStages()!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
          //console.log(response);
          
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
          console.error('There was an error!', error);
        },
        complete: () => {
      
        }
      });
  
    }
  
    
  }
  
