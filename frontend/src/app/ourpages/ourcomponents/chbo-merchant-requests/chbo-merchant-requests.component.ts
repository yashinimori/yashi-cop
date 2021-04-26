import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-chbo-merchant-requests',
  templateUrl: './chbo-merchant-requests.component.html',
  styleUrls: ['./chbo-merchant-requests.component.scss']
})
export class ChboMerchantRequestsComponent implements OnInit, OnDestroy {

  constructor(private datePipe: DatePipe, private translate: TranslateService) { }

  settingsMerchantRequests: any;
  sourceMerchantRequests: LocalDataSource;
  translationChangeSubscription: Subscription = new Subscription();
  pagerSize: number = 10;

  ngOnInit(): void {
    this.setSettingsGridMerchantRequests();
    this.translationChangeSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.setSettingsGridMerchantRequests();
    });
  }

  ngOnDestroy(): void {
    this.translationChangeSubscription.unsubscribe();
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
          title: this.translate.instant('chbo_merchant_requests_component.text2'),
          type: 'string',
        },
        terminal: {
          title: this.translate.instant('chbo_merchant_requests_component.text3'),
          type: 'string',
        },
        amount: {
          title: this.translate.instant('chbo_merchant_requests_component.text4'),
          type: 'string',
        },
        currency: {
          title: this.translate.instant('chbo_merchant_requests_component.text5'),
          type: 'string',
        },
        trans_date: {
          title: this.translate.instant('chbo_merchant_requests_component.text6'),
          valuePrepareFunction: (trans_date) => {
            if(trans_date)
              return this.datePipe.transform(new Date(trans_date), 'dd-MM-yyyy');
            else
              return '';
          }
        },
        request_reason: {
          title: this.translate.instant('chbo_merchant_requests_component.text7'),
          type: 'string',
        }
      },
    }; 
  }

}
