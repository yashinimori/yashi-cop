import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { AtmTransactionView } from '../../../share/models/atm-transaction.model';
import { DatePipe } from '@angular/common';
import { HttpService } from '../../../share/services/http.service';
import { Subscription } from 'rxjs';
import { ErrorService } from '../../../share/services/error.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-atm-log-view-detail',
  templateUrl: './atm-log-view-detail.component.html',
  styleUrls: ['./atm-log-view-detail.component.scss']
})
export class ATMlogViewerDetailComponent implements OnInit, OnDestroy {
  atmTransactionsData: Array<AtmTransactionView>;
  settings: any;
  source: LocalDataSource;
  role: string;
  filesArr: Array<any> = new Array<any>();
  selectedFile: any;
  //acceptFiles = 'application/txt/, application/pdf, image/*, application/msword, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';
  acceptFiles = 'application/txt/*';
  isShowGrid = true;
  atmTransactionsDataItem: AtmTransactionView;

  constructor(private datePipe: DatePipe, private translate: TranslateService,
    private httpService: HttpService, private errorService: ErrorService) {    
      this.atmTransactionsDataItem = new AtmTransactionView();
  }

  atmLogViewDetailSubscription: Subscription = new Subscription();
  translationChangeSubscription: Subscription = new Subscription();
  
  onUserRowSelect(event): void {
    //this.transferService.cOPClaimID.next(event.data.id);
    //this.router.navigate(['ourpages', 'ourcomponents', 'single-claim']);
    this.isShowGrid = false;
    this.atmTransactionsDataItem = new AtmTransactionView();
    this.atmTransactionsDataItem = this.atmTransactionsData.find(i=>i.id == event.data.id);
  }

  ngOnInit(): void {
    this.translationChangeSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.setSettingsGrid(this.role);
      this.getTransactionsData();
      this.hideColumnForUser(this.role);
    });
    this.isShowGrid = true;
    this.atmTransactionsDataItem = new AtmTransactionView();

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
              title: this.translate.instant('atm_log_view_details_component.text19'),
              valuePrepareFunction: (trans_date) => {
                if(trans_date)
                  return this.datePipe.transform(new Date(trans_date), 'dd-MM-yyyy hh:mm:ss');
                else
                  return '';
              }
            }, 
            pan: {
              title: this.translate.instant('atm_log_view_details_component.text20'),
              type: 'string',
            },
            pin_entered:{
              title: this.translate.instant('atm_log_view_details_component.text21'),
                valuePrepareFunction: (pin_entered) => {
                  if(pin_entered)
                    return this.datePipe.transform(new Date(pin_entered), 'dd-MM-yyyy hh:mm:ss');
                  else
                    return '';
                }
            },
            cash_request:{
              title: this.translate.instant('atm_log_view_details_component.text22'),
                valuePrepareFunction: (cash_request) => {
                  if(cash_request)
                    return this.datePipe.transform(new Date(cash_request), 'dd-MM-yyyy hh:mm:ss');
                  else
                    return '';
                }
            },
            trans_amount: {
              title: this.translate.instant('atm_log_view_details_component.text23'),
              type: 'string',
            },
            currency: {
              title: this.translate.instant('atm_log_view_details_component.text24'),
              type: 'string',
            },
            approval_code: {
              title: this.translate.instant('atm_log_view_details_component.text25'),
              type: 'string',
            },
            cash_presented:{
              title: this.translate.instant('atm_log_view_details_component.text26'),
                valuePrepareFunction: (cash_presented) => {
                  if(cash_presented)
                    return this.datePipe.transform(new Date(cash_presented), 'dd-MM-yyyy hh:mm:ss');
                  else
                    return '';
                }
            },
            cash_taken:{
              title: this.translate.instant('atm_log_view_details_component.text27'),
                valuePrepareFunction: (cash_taken) => {
                  if(cash_taken)
                    return this.datePipe.transform(new Date(cash_taken), 'dd-MM-yyyy hh:mm:ss');
                  else
                    return '';
                }
            },
            cash_count: {
              title: this.translate.instant('atm_log_view_details_component.text28'),
              type: 'string',
            },
            card_taken:{
              title: this.translate.instant('atm_log_view_details_component.text29'),
                valuePrepareFunction: (card_taken) => {
                  if(card_taken)
                    return this.datePipe.transform(new Date(card_taken), 'dd-MM-yyyy hh:mm:ss');
                  else
                    return '';
                }
            },
            cash_retracted:{
              title: this.translate.instant('atm_log_view_details_component.text30'),
               valuePrepareFunction: (cash_retracted) => {
                 if(cash_retracted)
                   return this.datePipe.transform(new Date(cash_retracted), 'dd-MM-yyyy hh:mm:ss');
                 else
                   return '';
               }
            },
            error: {
              title: this.translate.instant('atm_log_view_details_component.text31'),
              type: 'string',
            },
            trans_end:{
              title: this.translate.instant('atm_log_view_details_component.text32'),
               valuePrepareFunction: (trans_end) => {
                 if(trans_end)
                   return this.datePipe.transform(new Date(trans_end), 'dd-MM-yyyy hh:mm:ss');
                 else
                   return '';
               }
            },
            result: {
              title: this.translate.instant('atm_log_view_details_component.text33'),
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
    this.atmTransactionsData = new Array<AtmTransactionView>();
    let self = this;
    this.atmLogViewDetailSubscription = this.httpService.getTransactionsList(10, 1).subscribe({
      next: (response: any) => {
        this.atmTransactionsData = response.results;
        self.source = new LocalDataSource();
        self.source.load(self.atmTransactionsData);
      },
      error: error => {
        this.errorService.handleError(error);
        this.errorService.handleErrorToast(error);
        console.error('There was an error!', error);
      },
      complete: () => {
      }
    });
  }

  ngOnDestroy(): void {
    this.atmLogViewDetailSubscription.unsubscribe();
    this.translationChangeSubscription.unsubscribe();
  }

  goBack(){
    this.isShowGrid = true;
  }    

  getDateFormat(date: Date){
    if(date) 
      return this.datePipe.transform(new Date(date), 'dd-MM-yyyy hh:mm:ss');
    return '';
  }    

}
