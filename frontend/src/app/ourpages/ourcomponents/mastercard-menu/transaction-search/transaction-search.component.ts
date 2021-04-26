import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { TransferService } from '../../../../share/services/transfer.service';
import { Subscription } from 'rxjs';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-transaction-search',
  templateUrl: './transaction-search.component.html',
  styleUrls: ['./transaction-search.component.scss']
})
export class TransactionSearchComponent implements OnInit, OnDestroy {

  constructor(private datePipe: DatePipe, private translate: TranslateService, private router: Router, private transferService: TransferService) { }
 
  pagerSize = 10;
  settings: any;
  source: LocalDataSource;
  isLoadTabsInfo: boolean = false;
  translationChangeSubscription: Subscription = new Subscription();

  panInput:string;
  arnInput:string;
  amountFrom:string;
  amountTo:string;
  startDate:any;
  endDate:any;
  authSummaryArr:any;
  clearingSummaryArr:any;
  clearingSummaryObj = {
    "primaryAccountNumber": "5488888888887192",
    "transactionAmountLocal": "2500",
    "dateAndTimeLocal": "170719010100",
    "cardDataInputCapabililty": "5",
    "cardholderAuthenticationCapability": "9",
    "cardPresent": "1",
    "acquirerReferenceNumber": "05413364365000000000667",
    "cardAcceptorName": "TEST MERCHANT NAME",
    "currencyCode": "840",
    "installmentPaymentDataBrazil": "4070000000479500302000000015983000000000000000000000000",
    "transactionId": "U7dImb1ncs24LKNU9dDpl+FHlPzyfYOOvS5PijTlO6wHH09l7aiVJ1KJHp3sWPUHH0l90J1U82DGrE3hq72ARA=",
    "cardDataInputCapability": "5",
    "settlementIndicator": "C"
  }
  authSummaryObj = {
      "originalMessageTypeIdentifier": "0110",
      "banknetDate": "160107",
      "transactionAmountUsd": "401.17",
      "primaryAccountNumber": "5488888888887192",
      "processingCode": "00",
      "transactionAmountLocal": "000000010000",
      "authorizationDateAndTime": "1008125633",
      "authenticationId": "111111",
      "cardAcceptorName": "MASTERCARD",
      "cardAcceptorCity": "SAINT LOUIS",
      "cardAcceptorState": "MO",
      "currencyCode": "840",
      "chipPresent": "N",
      "transactionId": "hqCnaMDqmto4wnL+BSUKSdzROqGJ7YELoKhEvluycwKNg3XTzSfaIJhFDkl9hW081B5tTqFFiAwCpcocPdB2My4t7DtSTk63VXDl1CySA8Y=",
      "track1": "N",
      "track2": "Y101"
  }

  ngOnInit(): void {
    this.translationChangeSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.setSettingsForTable();
    });
    this.authSummaryArr = this.parseObjectToArray(this.authSummaryObj);
    this.clearingSummaryArr = this.parseObjectToArray(this.clearingSummaryObj);
    this.setSettingsForTable();
    this.source = new LocalDataSource();
    this.source.load([{
      id: 1,
      pan: '4000002222222222',
    date:  '2020-11-19T12:15:59.761294Z',      
    merch_name_ips:  'test',
    trans_amount: 100,
    trans_currency:  'usd',
    auth_code:  '2210'}]);
  }

  ngOnDestroy(): void {
    this.translationChangeSubscription.unsubscribe();
  }

  parseObjectToArray(obj) {
    let arr = [];
    for(let i = 0; i < Object.keys(obj).length; i++) {
      arr[i] = {
        title: Object.keys(obj)[i],
        value: obj[Object.keys(obj)[i]]
      }
    }
    return arr;
  }

  searchData() {
    console.log(this.panInput);
    console.log(this.arnInput);
    console.log(this.amountFrom);
    console.log(this.amountTo);
    console.log(this.startDate);
    console.log(this.endDate);
  }

  onUserRowSelect(event): void {
    this.isLoadTabsInfo = true;
    this.transferService.transactionMastercardID.next(event.data.id);
    this.router.navigate(['cop','cabinet', 'mastercard-transaction-info']);

  }

  setSettingsForTable() {
    this.settings = {
      pager:{perPage: this.pagerSize},
      hideSubHeader: true,
      //hideSubHeader: true,
      actions:{
        add: false,
        edit: false,
        delete: false,
      },
      columns: {
        pan: {
          title: this.translate.instant('transaction_search_component.text11'),
          type: 'string',
        },
        date: {
          title: this.translate.instant('transaction_search_component.text12'),
          // sort: true,
          // sortDirection: 'desc',
          valuePrepareFunction: (date) => {
            if(date)
              return this.datePipe.transform(new Date(date), 'dd-MM-yyyy');
            else
              return '';
          }
        },      
        merch_name_ips: {
          title: this.translate.instant('transaction_search_component.text13'),
          type: 'string',
        },
        trans_amount: {
          title: this.translate.instant('transaction_search_component.text14'),
          type: 'number',
        },
        trans_currency: {
          title: this.translate.instant('transaction_search_component.text15'),
          type: 'string',
        },
        auth_code: {
          title: this.translate.instant('transaction_search_component.text16'),
          type: 'string',
        },
      },
    };
  }

}
