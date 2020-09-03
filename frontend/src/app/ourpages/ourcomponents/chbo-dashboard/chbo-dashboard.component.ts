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
    all_new_claims: any;
    all_updated_claims: any;
    
    constructor(private httpServise: HttpService, private datePipe: DatePipe, private theme: NbThemeService){
        
    }
    ngOnInit(): void {
      this.all_new_claims = 0;
      this.all_updated_claims = 0;
      this.loadCountUpdatedClaims();
      this.loadCountNewClaims();
         }

    loadCountUpdatedClaims(){
          //console.log('loadCountUpdatedClaims()');
          this.httpServise.getCountUpdatedClaims().subscribe({
            next: (response: any) => {
              console.log(response);
              this.all_updated_claims = response['updated_claims'];
            },
            error: error => {
              console.error('There was an error!', error);
            },
            complete: () => {
             
            }
          });
      
        }

    loadCountNewClaims(){
          console.log('getCountClaimsByStages()');
          this.httpServise.getCountNewClaims().subscribe({
            next: (response: any) => {
              console.log(response);
              console.log('FEEEEEEEEEEEEEE');
              this.all_new_claims = response['new_claims'];
            },
            error: error => {
              console.error('There was an error!', error);
            },
            complete: () => {
          
            }
          });
      
        }
      ngOnDestroy(): void {
    
    }
}