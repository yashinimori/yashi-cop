import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'ngx-chbo-merchant-requests',
  templateUrl: './chbo-merchant-requests.component.html',
  styleUrls: ['./chbo-merchant-requests.component.scss']
})
export class ChboMerchantRequestsComponent implements OnInit {

  constructor(private datePipe: DatePipe) { }

  settingsMerchantRequests: any;
  sourceMerchantRequests: LocalDataSource;
  pagerSize: number = 10;

  ngOnInit(): void {
    this.setSettingsGridMerchantRequests();
  }

  getDocuments() {

  }

  onUserRowSelect(event): void {
    
  }

  setSettingsGridMerchantRequests() {
    this.settingsMerchantRequests = {
      pager:{perPage: this.pagerSize},
      //hideSubHeader: true,
      actions:{
        add: false,
        edit: false,
        delete: false,
      },
      columns: {
        merchant: {
          title: 'Merchant',
          type: 'string',
        },
        terminal: {
          title: 'Terminal',
          type: 'string',
        },
        amount: {
          title: "Amount",
          type: 'string',
        },
        currency: {
          title: 'Currency',
          type: 'string',
        },
        trans_date: {
          title: 'Transaction date',
          valuePrepareFunction: (trans_date) => {
            if(trans_date)
              return this.datePipe.transform(new Date(trans_date), 'dd-MM-yyyy');
            else
              return '';
          }
        },
        request_reason: {
          title: 'Request Reason',
          type: 'string',
        }
      },
    }; 
  }

}
