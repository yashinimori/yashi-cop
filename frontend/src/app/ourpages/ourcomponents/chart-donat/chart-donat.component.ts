import {Component, OnInit} from '@angular/core'
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import { ClaimView } from '../../../share/models/claim-view.model';
import { HttpService } from '../../../share/services/http.service';
import { Subscription } from 'rxjs';
import { LocalDataSource } from 'ng2-smart-table';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-chart-donat',
    templateUrl: './chart-donat.component.html',
})
export class ChartDonatComponent {
    claims: any;
    doughnutChartLabels: Label[] = ['pre-mediation', 'mediation', 'chargeback', 'chargeback escalation', 'closed'];
    doughnutChartType: ChartType = 'doughnut';
    
    constructor(
      private httpServise: HttpService) {
    }
    
    

    claimsSubscription: Subscription = new Subscription();
    source: LocalDataSource;
    role: string;
    

    ngOnInit(): void {
      // this.getClaimsData();
      this.role = localStorage.getItem('role');
      // console.log(this.data)
      this.loadCountClaimsByStages();
      
    }

    doughnutChartData: MultiDataSet = [
      [this.claims['pre_mediation_claims'], this.claims['mediation_claims'], this.claims['chargeback_claims'], this.claims['chargeback_escalation_claims'], this.claims['closed_claims']]
    ];
  
    loadCountClaimsByStages(){
      //console.log('getCountClaimsByStages()');
      this.httpServise.getCountClaimsByStages().subscribe({
        next: (response: any) => {
          this.claims = response;
          console.log(this.claims['pre_mediation_claims']);
          console.log(response);
          doughnutChartData:  [
            [this.claims['pre_mediation_claims'], this.claims['mediation_claims'], this.claims['chargeback_claims'], this.claims['chargeback_escalation_claims'], this.claims['closed_claims']]
          ];
        },
        error: error => {
          console.error('There was an error!', error);
        },
        complete: () => {
         
        }
      });
  
    }
    
    
    
    ngOnDestroy(): void {
      this.claimsSubscription.unsubscribe();
    }
  }
  
