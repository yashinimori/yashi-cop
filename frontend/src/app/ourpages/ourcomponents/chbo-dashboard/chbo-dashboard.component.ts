import {Component, OnInit, OnDestroy } from '@angular/core'
import { ClaimView } from '../../../share/models/claim-view.model';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpService } from '../../../share/services/http.service';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-chbo-dashboard',
    templateUrl: './chbo-dashboard.component.html'
})
export class ChboDashboardComponent implements OnInit, OnDestroy{
    claimsData: Array<ClaimView>;
    claimsLen: Array<ClaimView>;
    source: LocalDataSource;
    

    constructor(private httpServise: HttpService){
        this.claimsData = new Array<ClaimView>();
        this.claimsLen = new Array<ClaimView>();
    }

    claimsSubscription: Subscription = new Subscription();

    ngOnInit(): void {
        this.getClaimsData();
      }

    getClaimsData() {
        console.log('loadClaims()');
        this.claimsData = new Array<ClaimView>();
        this.claimsLen = new Array<ClaimView>();
        let self = this;
        let pageSize = 0;
        let pageNumber = 0;
        this.claimsSubscription = this.httpServise.getClaimList(pageSize, pageNumber).subscribe({
          next: (response: any) => {
            console.log('loaded Claims '); 
            console.log(response);
    
            let data: any;
    
            if(pageSize > 0 && pageNumber > 0)
              data = response.results;
            else
              data = response;
    
            data.forEach(el => {
              let t = new ClaimView();
        
              t.id = el['id'];
              t.pan = el['pan'];
              t.trans_date = el['trans_date'];
              t.term_id = el['term_id'];
              t.trans_amount = el['trans_amount'];
              t.trans_currency = el['trans_currency'];
              t.auth_code = el['auth_code'];
              t.claim_reason_code = el['reason_code'];
              t.status = el['status'];
              t.action_needed = el['action_needed'];
              t.result = el['result'];
              t.due_date = el['due_date'];
              t.ch_comments = el['ch_comments'];
    
              let m = el['merchant'];
              // t.merch_name_ips = m['name_ips'];
    
              if(t.status === 'chargeback')
                self.claimsData.push(t);
                console.log('+');
              
              self.claimsLen.push(t);
              console.log(t);
    
            });
    
            //self.source = new LocalDataSource(self.claimsData);
            self.source = new LocalDataSource();
            //self.source.setPaging(1, 5);
            self.source.load(self.claimsData);
            //self.source .refresh();
    
            console.log(self.source);
            
          },
          error: error => {
            console.error('There was an error!', error);
          },
          complete: () => {
           
          }
        });
      }

      

      ngOnDestroy(): void {
        this.claimsSubscription.unsubscribe();
      }
}