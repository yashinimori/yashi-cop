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

  settings = {
    pager:{perPage: 5},
    hideSubHeader: true,
    actions:{
    // add: {
    //   addButtonContent: '<i class="nb-plus"></i>',
    //   createButtonContent: '<i class="nb-checkmark"></i>',
    //   cancelButtonContent: '<i class="nb-close"></i>',
    // },
    // edit: {
    //   editButtonContent: '<i class="nb-edit"></i>',
    //   saveButtonContent: '<i class="nb-checkmark"></i>',
    //   cancelButtonContent: '<i class="nb-close"></i>',
    // },
    // delete: {
    //   deleteButtonContent: '<i class="nb-trash"></i>',
    //   confirmDelete: true,
    // },
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      claim_id: {
        title: 'Номер',
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
      merchant_name: {
        title: "Назва торговця",
        type: 'string',
      },
      term_id: {
        title: "Ім'я терміналу",
        type: 'string',
      },
      amount: {
        title: "Cума",
        type: 'number',
      },
      currency_name: {
        title: "Валюта",
        type: 'string',
      },
      auth_code: {
        title: "Код авторизації",
        type: 'number',
      },
      reason_code_group: {
        title: "Reason Code Group",
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
          //return this.datePipe.transform(new Date(due_date), 'dd-MM-yyyy');
          if(due_date)
            return this.datePipe.transform(new Date(due_date), 'dd-MM-yyyy hh:mm:ss');
          else
            return '';
        }
      },

    },
  };

  
  source: LocalDataSource;

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
    this.transferService.cOPClaimID.next(event.cOPClaimID);
    this.router.navigate(['ourpages', 'ourcomponents', 'single-claim']);
    console.log(event);
  }

  ngOnInit(): void {
    this.getClaimsData();
  }

  getClaimsData() {
    console.log('loadClaims()'); 
    this.claimsData = new Array<ClaimView>();
    let self = this;
    this.claimsSubscription = this.httpServise.getClaimList().subscribe({
      next: (response: any) => {
        
        console.log(response); 
        
        console.log('loadClaims() res'); 
        
        response.results.forEach(el => {
          let t = new ClaimView();
    
          t.claim_id = el['id'];
          t.pan = el['pan'];
          t.trans_date = el['trans_date'];
          t.merch_name_ips = el['merch_name_ips'];
          t.term_id = el['term_id'];
          t.amount = el['amount'];
          t.currency = el['currency'];
          t.auth_code = el['auth_code'];
          t.reason_code_group = el['reason_code_group'];
          t.stage = el['stage'];
          t.action_needed = el['action_needed'];
          t.result = el['result'];
          t.due_date = el['due_date'];
          
          self.claimsData.push(t);
          
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
