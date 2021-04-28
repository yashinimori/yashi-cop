import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';
import { TransferService } from '../../../share/services/transfer.service';

@Component({
  selector: 'ngx-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, OnDestroy {

  constructor(private datePipe: DatePipe, 
    private router: Router, 
    private transferService: TransferService,
    private translate: TranslateService) { }

  settings: any;
  source: LocalDataSource;
  translationChangeSubscription: Subscription = new Subscription();
  role: string;
  pagerSize = 10;
  transactionsArr: Array<any> = [
    {
      "id": 1,
      "number": "668",
      "pan": "5001007068569876",
      "date": "2020-12-15T00:00:02Z",
      "time":  "12:21",
      "amnt": "134",
      "curr": "uah",
      "auth_code": "000001",
      "result":  "-1"
    }
  ];

  ngOnInit(): void {
    this.translationChangeSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.setSettingsForTable();
    });
    this.setSettingsForTable();
    this.setCustomData();
  }

  ngOnDestroy(): void {
    this.translationChangeSubscription.unsubscribe();
  }

  onUserRowSelect(event) {
    this.transferService.transactionID.next(event.data.id);
    this.router.navigate(['cop', 'cabinet', 'transaction-info']);
  }

  setCustomData() {
    this.source = new LocalDataSource();
    this.source.load(this.transactionsArr);
  }

  setSettingsForTable() {
    this.settings = {
      pager:{perPage: this.pagerSize},
      hideSubHeader: true,
      actions:{
        add: false,
        edit: false,
        delete: false,
      },
      columns: {
        number: {
          title: '№',
          type: 'string',
        },  
        pan: {
          title: this.translate.instant('transactions_component.text5'),
          type: 'string',
        },
        date: {
          title: this.translate.instant('transactions_component.text6'),
          valuePrepareFunction: (DATE) => {
            if(DATE)
              return this.datePipe.transform(new Date(DATE), 'dd-MM-yyyy');
            else
              return '';
          }
        },
        time: {
          title: this.translate.instant('transactions_component.text7'),
          type: 'string',
        },
        amnt: {
          title: this.translate.instant('transactions_component.text8'),
          type: 'string',
        },
        curr: {
          title: this.translate.instant('transactions_component.text9'),
          type: 'string',
        },
        auth_code: {
          title: this.translate.instant('transactions_component.text10'),
          type: 'string',
        },
        result: {
          title: this.translate.instant('transactions_component.text11'),
          type: 'string',
        }
      },
    };
  }
}
