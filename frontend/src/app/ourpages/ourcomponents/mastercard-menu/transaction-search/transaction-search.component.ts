import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { TransferService } from '../../../../share/services/transfer.service';

@Component({
  selector: 'ngx-transaction-search',
  templateUrl: './transaction-search.component.html',
  styleUrls: ['./transaction-search.component.scss']
})
export class TransactionSearchComponent implements OnInit {

  constructor(private datePipe: DatePipe, private router: Router, private transferService: TransferService) { }
  pagerSize = 10;
  settings: any;
  source: LocalDataSource;
  isLoadTabsInfo: boolean = false;

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
          title: 'Номер карти',
          type: 'string',
        },
        date: {
          title: 'Дата транзакції',
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
          title: "Назва торговця",
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
          title: "ARN",
          type: 'string',
        },
      },
    };
  }

}
