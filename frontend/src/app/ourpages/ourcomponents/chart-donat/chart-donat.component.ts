import {Component, OnInit} from '@angular/core'
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import { ClaimView } from '../../../share/models/claim-view.model';
import { HttpService } from '../../../share/services/http.service';
import { Subscription } from 'rxjs';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
    selector: 'app-chart-donat',
    templateUrl: './chart-donat.component.html',
})
export class ChartDonatComponent {
    pre = 0;
    med = 0;
    chb = 0;
    chbe = 0;
    clo = 0;  
  claimsData: Array<ClaimView>;
    doughnutChartLabels: Label[] = ['pre-mediation', 'mediation', 'chargeback', 'chargeback escalation', 'closed'];
    doughnutChartType: ChartType = 'doughnut';
    
    constructor(
      private httpServise: HttpService) {
      this.claimsData = new Array<ClaimView>();
    }
    
    doughnutChartData: MultiDataSet = [
      [this.pre, this.med, this.chb, this.chbe, this.clo]
    ];

    claimsSubscription: Subscription = new Subscription();
    source: LocalDataSource;
    
    ngOnInit(): void {
  
      this.getClaimsData();

    }
    
    
    getClaimsData() {
      console.log('loadClaims()');
      this.claimsData = new Array<ClaimView>();
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
            console.log(m);
            if(m) 
              t.merch_name_ips = m['name_ips'];
            
            
            
            if (t.status['stage'] === 'pre_mediation')
              this.pre += 1;
            if (t.status['stage'] === 'mediation')
              this.med += 1;
            if (t.status['stage'] === 'chargeback')
              this.chb += 1;
            if (t.status['stage'] === 'chargeback_escalation')
              this.chbe += 1;
            if (t.status['stage'] === 'closed')
              this.clo += 1;

            console.log(this.pre)
            console.log(this.med)
            console.log(this.chb)
            console.log(this.chbe)
            console.log(this.clo)

            self.claimsData.push(t);
            
            //console.log(t);
            
  
          });
          
  
          //self.source = new LocalDataSource(self.claimsData);
          self.source = new LocalDataSource();
          //self.source.setPaging(1, 5);
          self.source.load(self.claimsData);
          //self.source .refresh();
  
          //console.log(self.source);
          
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
  
