import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';
import { ClaimView } from '../../../share/models/claim-view.model';
import { DatePipe } from '@angular/common';
import { TransferService } from '../../../share/services/transfer.service';
import { HttpService } from '../../../share/services/http.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss']
})
export class ClaimsComponent implements OnInit, OnDestroy {
  claimsData: Array<ClaimView>;
  settings: any;
  source: LocalDataSource;
  role: string;

  constructor(private datePipe: DatePipe, 
    private transferService: TransferService,
    private router: Router,
    private httpServise: HttpService) {
    this.claimsData = new Array<ClaimView>();
  }

  claimsSubscription: Subscription = new Subscription();
  
  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onUserRowSelect(event): void {
    this.transferService.cOPClaimID.next(event.data.id);
    this.router.navigate(['ourpages', 'ourcomponents', 'single-claim']);
  }

  ngOnInit(): void {
    
    this.role = localStorage.getItem('role');
    console.log('ClaimsComponent role ' +this.role);

    this.setSettingsGrid(this.role);
    this.getClaimsData();
    this.hideColumnForUser(this.role);
  }


  hideColumnForUser(role:string){
    if(role && (role == 'cardholder' || role == 'user')){
        delete this.settings.columns.id;
    }
  }
  
  setSettingsGrid(role:string){
    console.log('setSettingsGrid(c:string)' + role);

    switch(role){
      case 'admin':
      case 'chargeback_officer':  {
        this.settings = {
          pager:{perPage: 5},
          //hideSubHeader: true,
          actions:{
            add: false,
            edit: false,
            delete: false,
          },
          columns: {
            id: {
              title: 'ID',
              type: 'string',
            },
            pan: {
              title: 'Номер карти',
              type: 'string',
            },
            trans_date: {
              title: 'Дата транзакції',
              valuePrepareFunction: (trans_date) => {
                if(trans_date)
                  return this.datePipe.transform(new Date(trans_date), 'dd-MM-yyyy hh:mm:ss');
                else
                  return '';
              }
            },      
            merch_name_ips: {
              title: "Назва торговця",
              type: 'string',
            },
            term_id: {
              title: "Ім'я терміналу",
              type: 'string',
            },
            trans_amount: {
              title: "Cума",
              type: 'number',
            },
            trans_currency: {
              title: "Валюта",
              type: 'string',
            },
            auth_code: {
              title: "Код авторизації",
              type: 'number',
            },
            claim_reason_code: {
              title: "Reason Code",
              type: 'number',
            },
            stage: {
              title: "Статус",
              type: 'string',
            },
            action_needed: {
              title: "Індикатор",
              type: 'string',
            },
            result: {
              title: "Результат",
              type: 'string',
            },
            due_date: {
              title: 'Кінцевий термін претензії.',
              valuePrepareFunction: (due_date) => {
                if(due_date)
                  return this.datePipe.transform(new Date(due_date), 'dd-MM-yyyy hh:mm:ss');
                else
                  return '';
              }
            },
      
          },
        };
      }
      break;
      case 'merchant':
      case 'cardholder':
      case 'user': {
        this.settings = {
          pager:{perPage: 5},
          //hideSubHeader: true,
          actions:{
            add: false,
            edit: false,
            delete: false,
          },
          columns: {
            id: {
              title: '#',
              type: 'string',
              hidden: true,
              filter: false,               
            },
            pan: {
              title: 'Номер карти',
              type: 'string',
            },
            trans_date: {
              title: 'Дата транзакції',
              valuePrepareFunction: (trans_date) => {
                if(trans_date)
                  return this.datePipe.transform(new Date(trans_date), 'dd-MM-yyyy hh:mm:ss');
                else
                  return '';
              }
            },  
            term_id: {
              title: "Ім'я терміналу",
              type: 'string',
            },    
            merch_name_ips: {
              title: "Назва торговця",
              type: 'string',
            },
            claim_reason_code: {
              title: "Reason Code",
              type: 'number',
            },
            due_date: {
              title: 'Кінцевий термін претензії.',
              valuePrepareFunction: (due_date) => {
                if(due_date)
                  return this.datePipe.transform(new Date(due_date), 'dd-MM-yyyy hh:mm:ss');
                else
                  return '';
              }
            },
            action_needed: {
              title: "Індикатор",
              type: 'string',
            },
          },
        };
      }
      break;
      default: {
        this.settings = {
          actions:{
            add: false,
            edit: false,
            delete: false,
          },
        };
      }

    }
    

  }

  getClaimsData() {
    //console.log('loadClaims()'); 
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
          t.merch_name_ips = el['merch_name_ips'];
          t.term_id = el['term_id'];
          t.trans_amount = el['trans_amount'];
          t.trans_currency = el['trans_currency'];
          t.auth_code = el['auth_code'];
          t.claim_reason_code = el['reason_code'];
          t.stage = el['stage'];
          t.action_needed = el['action_needed'];
          t.result = el['result'];
          t.due_date = el['due_date'];
          
          self.claimsData.push(t);
          
          //console.log(t);

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
