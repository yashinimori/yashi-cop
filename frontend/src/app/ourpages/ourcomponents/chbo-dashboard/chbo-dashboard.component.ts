import {Component, OnInit, OnDestroy, NgModule } from '@angular/core'
import { ClaimView } from '../../../share/models/claim-view.model';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpService } from '../../../share/services/http.service';
import { Subscription } from 'rxjs';
import { ClaimComment } from '../../../share/models/claim-comment.model';
import { DatePipe } from '@angular/common';
// import { ChartjsPieComponent } from '../../../pages/charts/chartjs/chartjs-pie.component';
import { NbThemeService } from '@nebular/theme';


@Component({
    selector: 'app-chbo-dashboard',
    
    templateUrl: './chbo-dashboard.component.html',
    
})
export class ChboDashboardComponent implements OnInit, OnDestroy{
    claimsLen: Array<ClaimView>;
    claimsData: Array<ClaimView>;
    source: LocalDataSource;
    claimData: ClaimView;
    claimId: any;
    data: any;
    options: any;
    themeSubscription: any;
    
    constructor(private httpServise: HttpService, private datePipe: DatePipe, private theme: NbThemeService){
        this.claimsLen = new Array<ClaimView>();
        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

          const colors: any = config.variables;
          const chartjs: any = config.variables.chartjs;
    
          this.data = {
            labels: ['Download Sales', 'In-Store Sales', 'Mail Sales'],
            datasets: [{
              data: [300, 500, 100],
              backgroundColor: [colors.primaryLight, colors.infoLight, colors.successLight],
            }],
          };
        });
    }
    // data = {
    //   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    //   datasets: [
    //     {
    //       label: 'My First Dataset',
    //       data: [65, 59, 80, 81, 56, 55, 40],
    //       fill: false,
    //       backgroundColor: [
    //         'rgba(255, 99, 132, 0.2)',
    //         'rgba(255, 159, 64, 0.2)',
    //         'rgba(255, 205, 86, 0.2)',
    //         'rgba(75, 192, 192, 0.2)',
    //         'rgba(54, 162, 235, 0.2)',
    //         'rgba(153, 102, 255, 0.2)',
    //         'rgba(201, 203, 207, 0.2)',
    //       ],
    //       borderColor: [
    //         'rgb(255, 99, 132)',
    //         'rgb(255, 159, 64)',
    //         'rgb(255, 205, 86)',
    //         'rgb(75, 192, 192)',
    //         'rgb(54, 162, 235)',
    //         'rgb(153, 102, 255)',
    //         'rgb(201, 203, 207)',
    //       ],
    //       borderWidth: 1,
    //     },
    //   ],
    // };
    comments: Array<ClaimComment>;
    // claimsData: ClaimView;
    claimsSubscription: Subscription = new Subscription();

    ngOnInit(): void {
        // this.getClaimsData();
        console.log(this.data)
      }

    
      ngOnDestroy(): void {
        // this.claimsSubscription.unsubscribe();
      }
}