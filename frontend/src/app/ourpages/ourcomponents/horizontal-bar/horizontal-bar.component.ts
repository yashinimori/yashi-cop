import {Component, OnInit} from '@angular/core'
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { HttpService } from '../../../share/services/http.service';
import { LocalDataSource } from 'ng2-smart-table';
import { NbThemeService, NbColorHelper } from '@nebular/theme';

@Component({
    selector: 'app-horizontal-bar',
    templateUrl: './horizontal-bar.component.html',
})

export class HorizontalBarComponent{
    types: any;
    themeSubscription: any;
    barChartOptions: ChartOptions = {
        responsive: true,
      };
      barChartLabels: Label[] = ['authorization_claims', 'cardholder_disputes_claims', 'fraud_claims', 'point_of_interaction_error_claims'];
      barChartType: ChartType = 'bar';
      barChartLegend = true;
      barChartPlugins = [];
      source: LocalDataSource;
      role: string;
      public barChartData: ChartDataSets[];
      is_bar_data_ready = false;
      data: any;
      options: any;
  httpServise: any;
      
      constructor(private theme: NbThemeService,
        ) {
           }
      // constructor(
      //   private httpServise: HttpService) {
      //     this.data = {
      //       labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
      //       datasets: [{
      //         data: [65, 59, 80, 81, 56, 55, 40],
      //         label: 'Series A',
      //         // backgroundColor: NbColorHelper.hexToRgbA(colors.primaryLight, 0.8),
      //       }, {
      //         data: [28, 48, 40, 19, 86, 27, 90],
      //         label: 'Series B',
      //         // backgroundColor: NbColorHelper.hexToRgbA(colors.infoLight, 0.8),
      //       }],
      //     };
      // }

      ngOnInit(): void{
        this.role = localStorage.getItem('role');
        this.someFunction();
        // this.loadCountClaimsByRcGroup();
      }
    

      someFunction(){
        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

          const colors: any = config.variables;
          const chartjs: any = config.variables.chartjs;
    
          this.data = {
            labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
            datasets: [{
              data: [65, 59, 80, 81, 56, 55, 40],
              label: 'Series A',
              backgroundColor: NbColorHelper.hexToRgbA(colors.primaryLight, 0.8),
            }, {
              data: [28, 48, 40, 19, 86, 27, 90],
              label: 'Series B',
              backgroundColor: NbColorHelper.hexToRgbA(colors.infoLight, 0.8),
            }],
          };
    
          this.options = {
            maintainAspectRatio: false,
            responsive: true,
            legend: {
              labels: {
                fontColor: chartjs.textColor,
              },
            },
            scales: {
              xAxes: [
                {
                  gridLines: {
                    display: false,
                    color: chartjs.axisLineColor,
                  },
                  ticks: {
                    fontColor: chartjs.textColor,
                  },
                },
              ],
              yAxes: [
                {
                  gridLines: {
                    display: true,
                    color: chartjs.axisLineColor,
                  },
                  ticks: {
                    fontColor: chartjs.textColor,
                  },
                },
              ],
            },
          };
        });
        }





      loadCountClaimsByRcGroup(){
        console.log('getCountClaimsByRcGroup()');
        this.httpServise.getCountClaimsByRcGroup().subscribe({
          next: (response: any) => {
            this.types = response;
            console.log('response');
            console.log(response);
            // this.barChartData = [
              
            //     // { data: [this.types['authorization_claims'], this.types['cardholder_disputes_claims'], this.types['fraud_claims'], this.types['point_of_interaction_error_claims']], 
            // { data: [1,2,3,4], label: 'типи скарг' }
            
            // ];
            console.log(this.barChartData);
          },
          error: error => {
            console.error('There was an error!', error);
          },
          complete: () => {
            this.is_bar_data_ready = true;
          }
        });
    
      }
  
  }