import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpService } from '../../../share/services/http.service';

@Component({
    selector: 'app-chart-statistic-claims-rc-group',
    templateUrl: './chart-statistic-claims-rc-group.component.html',
})
export class StatisticClaimsByRcGroupComponent implements OnInit, OnDestroy {  
    role: string;
    doughnutChartLabels: any;
    doughnutChartData: any;
    is_data_ready = false;

    chartOptions: any;
    subscription1: Subscription = new Subscription();

    constructor(private httpServise: HttpService) {
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
  
