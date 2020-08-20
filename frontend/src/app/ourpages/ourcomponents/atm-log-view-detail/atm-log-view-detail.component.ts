import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';
import { AtmTransactionView } from '../../../share/models/atm-transaction.model';
import { DatePipe } from '@angular/common';
import { TransferService } from '../../../share/services/transfer.service';
import { HttpService } from '../../../share/services/http.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'ngx-atm-log-view-detail',
  templateUrl: './atm-log-view-detail.component.html',
  styleUrls: ['./atm-log-view-detail.component.scss']
})
export class ATMlogViewerDetailComponent implements OnInit, OnDestroy {
  armTransactionsData: Array<AtmTransactionView>;
  settings: any;
  source: LocalDataSource;
  role: string;
  filesArr: Array<any> = new Array<any>();
  selectedFile: any;
  //acceptFiles = 'application/txt/, application/pdf, image/*, application/msword, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';
  acceptFiles = 'application/txt/*';

  constructor(private datePipe: DatePipe, 
    private transferService: TransferService,
    private router: Router,
    private httpService: HttpService) {
    
  }

  atmLogViewDetailSubscription: Subscription = new Subscription();
  
  
  onUserRowSelect(event): void {
    //this.transferService.cOPClaimID.next(event.data.id);
    //this.router.navigate(['ourpages', 'ourcomponents', 'single-claim']);
  }

  ngOnInit(): void {
    
    this.role = localStorage.getItem('role');
    
    this.setSettingsGrid(this.role);
    this.getTransactionsData();
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
             trans_start: {
               title: 'Початок транзакції',
               valuePrepareFunction: (trans_date) => {
                 if(trans_date)
                   return this.datePipe.transform(new Date(trans_date), 'dd-MM-yyyy hh:mm:ss');
                 else
                   return '';
               }
             }, 
            pan: {
              title: 'Номер карти',
              type: 'string',
            },
            pin_entered:{
              title: 'PIN',
               valuePrepareFunction: (pin_entered) => {
                 if(pin_entered)
                   return this.datePipe.transform(new Date(pin_entered), 'dd-MM-yyyy hh:mm:ss');
                 else
                   return '';
               }
            },
            cash_request:{
              title: 'Запит грошей',
               valuePrepareFunction: (cash_request) => {
                 if(cash_request)
                   return this.datePipe.transform(new Date(cash_request), 'dd-MM-yyyy hh:mm:ss');
                 else
                   return '';
               }
            },
            trans_amount: {
              title: 'Сума',
              type: 'string',
            },
            currency: {
              title: 'Baлюта',
              type: 'string',
            },
            approval_code: {
              title: 'Код затвердження',
              type: 'string',
            },
            cash_presented:{
              title: 'Готівка представлена',
               valuePrepareFunction: (cash_presented) => {
                 if(cash_presented)
                   return this.datePipe.transform(new Date(cash_presented), 'dd-MM-yyyy hh:mm:ss');
                 else
                   return '';
               }
            },
            cash_taken:{
              title: 'Готівка отримана',
               valuePrepareFunction: (cash_taken) => {
                 if(cash_taken)
                   return this.datePipe.transform(new Date(cash_taken), 'dd-MM-yyyy hh:mm:ss');
                 else
                   return '';
               }
            },
            cash_count: {
              title: 'Кількість готівки',
              type: 'string',
            },
            card_taken:{
              title: 'Картка отримана',
               valuePrepareFunction: (card_taken) => {
                 if(card_taken)
                   return this.datePipe.transform(new Date(card_taken), 'dd-MM-yyyy hh:mm:ss');
                 else
                   return '';
               }
            },
            cash_retracted:{
              title: 'Відмома',
               valuePrepareFunction: (cash_retracted) => {
                 if(cash_retracted)
                   return this.datePipe.transform(new Date(cash_retracted), 'dd-MM-yyyy hh:mm:ss');
                 else
                   return '';
               }
            },
            trans_end:{
              title: 'Кінец транзакції',
               valuePrepareFunction: (trans_end) => {
                 if(trans_end)
                   return this.datePipe.transform(new Date(trans_end), 'dd-MM-yyyy hh:mm:ss');
                 else
                   return '';
               }
            },
            error: {
              title: 'Помилки',
              type: 'string',
            },
            result: {
              title: 'Результат',
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

  getTransactionsData() {
    console.log('getTransactionsData()'); 
    this.armTransactionsData = new Array<AtmTransactionView>();
    let self = this;
    this.atmLogViewDetailSubscription = this.httpService.getTransactionsList(10, 1).subscribe({
      next: (response: any) => {
        console.log('loaded Transactions'); 
        console.log(response);

        // response.results.forEach(el => {
        //   let t = new AtmTransactionView();
             
        //   t.pan = el['pan'];
          
        //   self.claimsData.push(t);
          
        //   //console.log(t);

        // });

        this.armTransactionsData = response.results;
        
        self.source = new LocalDataSource();
        self.source.load(self.armTransactionsData);
        

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
    this.atmLogViewDetailSubscription.unsubscribe();
  }

    

}
