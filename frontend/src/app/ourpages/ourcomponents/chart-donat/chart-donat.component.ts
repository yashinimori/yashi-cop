import {Component, OnInit} from '@angular/core';
import { HttpService } from '../../../share/services/http.service';
import { Subscription } from 'rxjs';
import { ChartOptions } from 'chart.js';

@Component({
    selector: 'app-chart-donat',
    templateUrl: './chart-donat.component.html',
})
export class ChartDonatComponent implements OnInit {
    ChartOptions: ChartOptions;
    role: string;
    doughnutChartLabels: any;
    doughnutChartData: any;
    is_data_ready = false;

    subscription1: Subscription = new Subscription();

    constructor(private httpServise: HttpService) {
    }

    ngOnInit(): void {
      this.ChartOptions = {
        // We use these empty structures as placeholders for dynamic theming.
        legend: {
          position: "right", // "center" , "right"
          align: "start",  // "top" , "bottom"
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
            'chb',
            'escal',
            // 'closed_claims',
            // 'dispute_claims',
            // 'dispute_response_claims',
            // 'final_ruling_claims',
            'med',
            // 'pre_arbitration_claims',
            // 'pre_arbitration_response_claims',
            'pre-med'
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
  
