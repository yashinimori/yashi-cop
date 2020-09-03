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

@Component({
    selector: 'app-horizontal-bar',
    templateUrl: './horizontal-bar.component.html',
})
export class HorizontalBarComponent implements OnInit {
   
    role: string;
    barLabels: any;
    barData: any;
    is_data_ready = false;

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
            'authorization_claims',
            'cardholder_disputes_claims',
            'fraud_claims',
            'point_of_interaction_error_claims',
          ];
          
          this.barData  = [{
            data: [
              response['authorization_claims'],
              response['cardholder_disputes_claims'],
              response['fraud_claims'],
              response['point_of_interaction_error_claims'],
              
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
  
    
  }
  
