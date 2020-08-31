import {Component, OnInit, OnDestroy, NgModule } from '@angular/core'
import { ClaimView } from '../../../share/models/claim-view.model';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpService } from '../../../share/services/http.service';
import { Subscription } from 'rxjs';
import { ClaimComment } from '../../../share/models/claim-comment.model';
import { DatePipe } from '@angular/common';
// import { ChartjsPieComponent } from '../../../pages/charts/chartjs/chartjs-pie.component';



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

    constructor(private httpServise: HttpService, private datePipe: DatePipe){
        this.claimsLen = new Array<ClaimView>();
        
    }

    comments: Array<ClaimComment>;
    // claimsData: ClaimView;
    claimsSubscription: Subscription = new Subscription();

    ngOnInit(): void {
        // this.getClaimsData();
      }

    
      ngOnDestroy(): void {
        // this.claimsSubscription.unsubscribe();
      }
}