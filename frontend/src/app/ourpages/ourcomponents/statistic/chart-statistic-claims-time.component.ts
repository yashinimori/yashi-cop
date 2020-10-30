import {Component, OnDestroy, OnInit} from '@angular/core';
import { HttpService } from '../../../share/services/http.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-chart-statistic-claims-time',
    templateUrl: './chart-statistic-claims-time.component.html',
})
export class StatisticClaimsByTimeComponent implements OnInit, OnDestroy {
   
    role: string;
    doughnutChartLabels: any;
    doughnutChartData: any;
    is_data_ready = false;

    chartOptions:any;
    subscription1: Subscription = new Subscription();

    constructor(private httpServise: HttpService) {
    }

    ngOnInit(): void {
      this.chartOptions = {
        responsive: true,
        aspectRatio: 1.2,
        maintainAspectRatio: false,
        legend: {
          position: 'top',
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
      this.httpServise.getCountClaimsByStages().subscribe({
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

            this.doughnutChartData  = [
                {data: [response['chargeback_claims']] , label: 'chargeback_claims'},
                {data: [response['chargeback_escalation_claims']], label: 'chargeback_claims'},
                {data: [response['mediation_claims']] , label: 'chargeback_claims'},
                {data: [response['pre_mediation_claims']] , label: 'chargeback_claims'}
            ];

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
  
