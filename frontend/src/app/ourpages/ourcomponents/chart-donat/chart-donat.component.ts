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
    selector: 'app-chart-donat',
    templateUrl: './chart-donat.component.html',
})
export class ChartDonatComponent {
    data: DoughnutTransfer;
    claims: any;
    doughnutChartLabels: Label[] = ['pre-mediation', 'mediation', 'chargeback', 'chargeback escalation', 'closed'];
    doughnutChartType: ChartType = 'doughnut';
    doughnutChartData: MultiDataSet = [];
    is_data_ready = false;
    colours = ["rgba(0, 108, 112, 1)",
            "rgba(224, 224, 0, 1)",
            "rgba(224, 0, 112, 1)",
            "rgba(224, 50, 37, 1)",
            "rgba(51, 70, 0, 1)"]
    constructor(public transferService: TransferService,
      public httpServise: HttpService) {
    }
    
    

    claimsSubscription: Subscription = new Subscription();
    source: LocalDataSource;
    role: string;
    

    ngOnInit(): void {
      console.log('ChartDonatComponent');
      // this.getClaimsData();
      this.role = localStorage.getItem('role');
      // console.log(this.data)
      console.log(this.doughnutChartData);
      //this.loadCountClaimsByStages();
      console.log(this.doughnutChartData);

      // this.data = this.transferService.doughnutTransfer.getValue();

      // if(this.data){
      //   this.doughnutChartLabels = this.data.chartLabels;
      //   this.doughnutChartType = this.data.chartType;
      //   this.doughnutChartData = this.data.chartData;
      //   this.colours = this.data.colours;
      // }

    }

    
  
    loadCountClaimsByStages(){
      //console.log('getCountClaimsByStages()');
      this.httpServise.getCountClaimsByStages().subscribe({
        next: (response: any) => {
          this.claims = response;
          console.log(this.claims['pre_mediation_claims']);
          console.log(response);
          this.doughnutChartData = [
            [this.claims['pre_mediation_claims'], this.claims['mediation_claims'], this.claims['chargeback_claims'], this.claims['chargeback_escalation_claims'], this.claims['closed_claims']]
          ];
          // this.doughnutChartData
        },
        error: error => {
          console.error('There was an error!', error);
        },
        complete: () => {
          this.is_data_ready = true;
        }
      });
  
    }
    
    
    
    ngOnDestroy(): void {
      this.claimsSubscription.unsubscribe();
    }
  }
  
