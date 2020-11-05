import {Component, OnDestroy, OnInit} from '@angular/core';
import { HttpService } from '../../../share/services/http.service';
import { Subscription } from 'rxjs';
import * as CanvasJS from '../../../../assets/canvasjs.min';
import { ErrorService } from '../../../share/services/error.service';

@Component({
    selector: 'app-chart-statistic-claims-reason',
    templateUrl: './chart-statistic-claims-reason.component.html',
})
export class StatisticClaimsByReasonComponent implements OnInit, OnDestroy {
   
    role: string;
    doughnutChartLabels: any;
    doughnutChartData: any;
    is_data_ready = false;
    subscription1: Subscription = new Subscription();
    chartOptions:any;

    constructor(private httpServise: HttpService, private errorService: ErrorService) {
    }

    ngOnInit(): void {
      // this.chartOptions = {
      //   responsive: true,
      //   aspectRatio: 1.2,
      //   maintainAspectRatio: false,
      //   legend: {
      //     position: 'top',
      //     labels: {
      //       fontSize: 10,
      //       usePointStyle: true
      //     }
      //   },
      // };
      // this.role = localStorage.getItem('role');

      // //   let data = this.transferService.claimsByStages.getValue();

      // this.doughnutChartData = [ { data: [] } ];
      // this.doughnutChartLabels = [];
      // this.loadCountClaimsByStages();
      
      this.renderChart();
      
    }

    renderChart() {
      let chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        // title:{
        //   text: "Google - Consolidated Quarterly Revenue",
        //   fontFamily: "arial black",
        //   fontColor: "#695A42"
        // },
        axisX: {
          labelAngle: -30
        },
        axisY:{
          valueFormatString:"#0",
          gridColor: "#a6a6a6",
          tickColor: "#a6a6a6"
        },
        toolTip: {
          shared: true,
          content: this.toolTipContent
        },
        data: [{
          type: "stackedColumn",
          showInLegend: true,
          color: "#4371c3",
          name: "Причина 1",
          dataPoints: [
            { y: 13.75, label: 'authorization' },
            { y: 7.57, label: 'cardholders' },
            { y: 10.64, label: 'merchants' },
            { y: 16.97, label: 'fraud' }
          ]
          },
          {        
            type: "stackedColumn",
            showInLegend: true,
            name: "Причина 2",
            color: "#e87e39",
            dataPoints: [
              { y: 12.75, label: 'authorization' },
              { y: 8.57, label: 'cardholders' },
              { y: 11.64, label: 'merchants' },
              { y: 7.97, label: 'fraud' }
            ]
          },
          {        
            type: "stackedColumn",
            showInLegend: true,
            name: "Причина 3",
            color: "#f7bf45",
            dataPoints: [
              { y: 2.75, label: 'authorization' },
              { y: 5.57, label: 'cardholders' },
              { y: 3.64, label: 'merchants' },
              { y: 13.97, label: 'fraud' }
            ]
          },
        //   {        
        //     type: "stackedColumn",
        //     showInLegend: true,
        //     name: "Причина 4",
        //     color: "#a8a8a8",
        //     dataPoints: [
        //       { y: 7.75, x: 'authorization' },
        //       { y: 5.57, x: 'cardholders' },
        //       { y: 12.64, x: 'merchants' },
        //       { y: 11.97, x: 'fraud' }
        //     ]
        // }
      ]
      });
        
      chart.render();
    }

    toolTipContent(e) {
      var str = "";
      var total = 0;
      var str2, str3;
      for (var i = 0; i < e.entries.length; i++){
        var  str1 = "<span style= \"color:"+e.entries[i].dataSeries.color + "\"> "+e.entries[i].dataSeries.name+"</span>: <strong>"+e.entries[i].dataPoint.y+"</strong><br/>";
        total = e.entries[i].dataPoint.y + total;
        str = str.concat(str1);
      }
      str2 = "<span style = \"color:DodgerBlue;\"><strong>"+e.entries[0].dataPoint.label+"</strong></span><br/>";
      total = Math.round(total * 100) / 100;
      str3 = "<span style = \"color:Tomato\">Total:</span><strong> "+total+"</strong><br/>";
      return (str2.concat(str)).concat(str3);
    }


    loadCountClaimsByStages(){
      this.subscription1 = this.httpServise.getCountClaimsByStages().subscribe({
        next: (response: any) => {
          this.doughnutChartLabels = [
            // 'arbitration_claims',
             'chargeback_claims',
             'chargeback_escalation_claims',
            // 'closed_claims',
            // 'dispute_claims',
            // 'dispute_response_claims',
            // 'final_ruling_claims',
             'mediation_claims',
            // 'pre_arbitration_claims',
            // 'pre_arbitration_response_claims',
             'pre_mediation_claims'
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
          this.errorService.handleError(error);
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
  
