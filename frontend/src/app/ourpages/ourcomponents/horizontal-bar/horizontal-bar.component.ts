import {Component, OnInit} from '@angular/core'
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { HttpService } from '../../../share/services/http.service';

@Component({
    selector: 'app-horizontal-bar',
    templateUrl: './horizontal-bar.component.html',
})

export class HorizontalBarComponent{
    types: any;
    barChartOptions: ChartOptions = {
        responsive: true,
      };
      barChartLabels: Label[] = ['authorization_claims', 'cardholder_disputes_claims', 'fraud_claims', 'point_of_interaction_error_claims'];
      barChartType: ChartType = 'bar';
      barChartLegend = true;
      barChartPlugins = [];
    
      barChartData: ChartDataSets;
    
      constructor(
        private httpServise: HttpService) {
      }

      ngOnInit(): void{
        this.loadCountClaimsByRcGroup();
      }
    
      loadCountClaimsByRcGroup(){
        //console.log('getCountClaimsByRcGroup()');
        this.httpServise.getCountClaimsByRcGroup().subscribe({
          next: (response: any) => {
            this.types = response;
            console.log('response');
            console.log(response);
            this.barChartData = [
              
                { data: [this.types['authorization_claims'], this.types['cardholder_disputes_claims'], this.types['fraud_claims'], this.types['point_of_interaction_error_claims']], label: 'типи скарг' }
            
            ];
          },
          error: error => {
            console.error('There was an error!', error);
          },
          complete: () => {
           
          }
        });
    
      }
  
  }