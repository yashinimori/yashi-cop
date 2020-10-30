import {Component, OnDestroy, OnInit} from '@angular/core';
import { HttpService } from '../../../share/services/http.service';
import { Subscription } from 'rxjs';
import { TransferService } from '../../../share/services/transfer.service';

@Component({
    selector: 'app-chart-statistic-claims-stages',
    templateUrl: './chart-statistic-claims-stages.component.html',
})
export class StatisticClaimsByStagesComponent implements OnInit, OnDestroy {
    role: string;
    doughnutChartLabels: any;
    doughnutChartData: any;
    is_data_ready = false;

    chartOptions:any;
    subscription1: Subscription = new Subscription();

    constructor(private transferService: TransferService,
      private httpServise: HttpService) {
    }

    ngOnInit(): void {
      this.chartOptions = {
        responsive: true,
        aspectRatio: 1.2,
        maintainAspectRatio: false,
        legend: {
          position: 'bottom',
          labels: {
            fontSize: 10,
            usePointStyle: true
          }
        },
      };
      this.role = localStorage.getItem('role');

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
  
