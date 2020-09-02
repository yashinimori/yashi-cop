import {Component, OnInit} from '@angular/core'
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { HttpService } from '../../../share/services/http.service';

@Component({
    selector: 'app-horizontal-bar',
    templateUrl: './horizontal-bar.component.html',
})

export class HorizontalBarComponent{

    barChartOptions: ChartOptions = {
        responsive: true,
      };
      barChartLabels: Label[] = ['Apple', 'Banana', 'Kiwifruit', 'Blueberry', 'Orange', 'Grapes'];
      barChartType: ChartType = 'bar';
      barChartLegend = true;
      barChartPlugins = [];
    
      barChartData: ChartDataSets[] = [
        { data: [45, 37, 60, 70, 46, 33], label: 'типи скарг' }
      ];
    
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
            console.log('response');
            console.log(response);
          },
          error: error => {
            console.error('There was an error!', error);
          },
          complete: () => {
           
          }
        });
    
      }
  
  }