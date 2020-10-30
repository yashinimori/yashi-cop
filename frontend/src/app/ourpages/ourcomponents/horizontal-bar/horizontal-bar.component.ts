import {Component, OnDestroy, OnInit} from '@angular/core';
import { HttpService } from '../../../share/services/http.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-horizontal-bar',
    templateUrl: './horizontal-bar.component.html',
})
export class HorizontalBarComponent implements OnInit, OnDestroy { 
  role: string;
  barLabels: any;
  barData: any;
  is_data_ready = false;

  public barChartLegend = false;
  constructor(private httpServise: HttpService) {
  }
  subscription1: Subscription = new Subscription();

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    this.barData = [ { data: [] } ];
    this.barLabels = [];
    this.loadCountClaimsByRcGroup();   
  }

  loadCountClaimsByRcGroup(){
    this.subscription1 = this.httpServise.getCountClaimsByRcGroup().subscribe({
      next: (response: any) => {
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
            response['authorization_claims'],
            response['cardholder_disputes_claims'],
            response['fraud_claims'],
            response['point_of_interaction_error_claims'],
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

  ngOnDestroy() {
    this.subscription1.unsubscribe();
  }
}
  
