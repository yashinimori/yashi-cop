import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { TransferService } from '../../../share/services/transfer.service';

@Component({
  selector: 'ngx-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  constructor(private datePipe: DatePipe, private router: Router, private transferService: TransferService) { }

  settings: any;
  source: LocalDataSource;
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
    this.setSettingsForTable();
    this.setCustomData();
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
          title: "Номер карти",
          type: 'string',
        },
        date: {
          title: 'Дата',
          valuePrepareFunction: (DATE) => {
            if(DATE)
              return this.datePipe.transform(new Date(DATE), 'dd-MM-yyyy');
            else
              return '';
          }
        },
        time: {
          title: "Час",
          type: 'string',
        },
        amnt: {
          title: "AMNT",
          type: 'string',
        },
        curr: {
          title: "Валюта",
          type: 'string',
        },
        auth_code: {
          title: "AUTH CODE",
          type: 'string',
        },
        result: {
          title: "Результат",
          type: 'string',
        }
      },
    };
  }
}
