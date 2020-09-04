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
import { ChartOptions } from 'chart.js';

@Component({
    selector: 'app-horizontal-bar',
    templateUrl: './horizontal-bar.component.html',
})
export class HorizontalBarComponent implements OnInit {
   
    role: string;
    barLabels: any;
    barData: any;
    is_data_ready = false;
    // chartOptions = {
    //   responsive: true
    // };
    

    public barChartLegend = false;
    constructor(private transferService: TransferService,
      private httpServise: HttpService) {
    }

    ngOnInit(): void {

      this.role = localStorage.getItem('role');
      
      //   console.log('transferService.claimsByStages.getValue()');
      //   let data = this.transferService.claimsByStages.getValue();
      //   console.log(data);

      this.barData = [ { data: [] } ];
      this.barLabels = [];
      this.loadCountClaimsByRcGroup();
      
    }


    loadCountClaimsByRcGroup(){
      console.log('getCountClaimsByStages()');
      this.httpServise.getCountClaimsByRcGroup().subscribe({
        next: (response: any) => {
          //console.log('getCountClaimsByStages()!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
          console.log(response);
          
          this.barLabels = [
            'Auth',
            'Consumer',
            'Fraud',
            'Merchant',
          ];

          
          
          this.barData  = [{


      //       datasets: [{
      //         label: "Authorization",
      //         backgroundColor: "red",
      //         // hoverBorderColor: "rgba(255,99,132,1)",
      //         data: [1],
      //      }, {
      //         label: "cardholder_disputes_claims",
      //         backgroundColor: "blue",
      //         // hoverBorderColor: "rgba(255,99,132,1)",
      //         data: [2],
      //      }, {
      //       label: "fraud_claims",
      //       backgroundColor: "green",
      //       // hoverBorderColor: "rgba(255,99,132,1)",
      //       data: [3],
      //    }, {
      //     label: "point_of_interaction_error_claims",
      //     backgroundColor: "yellow",
      //     // hoverBorderColor: "rgba(255,99,132,1)",
      //     data: [4],
      //  }]
            // data: [
            //   response['authorization_claims'],
            //   response['cardholder_disputes_claims'],
            //   response['fraud_claims'],
            //   response['point_of_interaction_error_claims'],
            
            // ]
            // categoryPercentage: 0.1,
            data: [
              1,
              2,
              3,
              4,
            ],
            backgroundColor: ["#efc6ce", "#f7e4a0", "#8cdbd5", "#90c5e5"],
            
            // label: [
            //   'authorization',
            // 'cardholder_disputes',
            // 'fraud',
            // 'point_of_interaction_error',
            // ], 
            
             
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
  
