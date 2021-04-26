import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.scss']
})
export class BankAccountsComponent implements OnInit, OnDestroy {

  constructor(private datePipe: DatePipe, private translate: TranslateService) { }

  settings: any;
  source: LocalDataSource;
  settings2: any;
  source2: LocalDataSource;
  role: string;
  pagerSize = 10;

  translationChangeSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.translationChangeSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.setSettingsGrid();
      this.setCustomData();
    });
    this.role = localStorage.getItem('role');
    this.setSettingsGrid();
    this.setCustomData();
  }

  ngOnDestroy(): void {
    this.translationChangeSubscription.unsubscribe();
  }

  onUserRowSelect(event): void {
    
  }
  onUserRowSelect2(event): void {
    
  }

  editRowFields(event) {
    console.log(event)
    event.isInEditing = true;
  }

  saveRow(event) {
    console.log(event)
    event.confirm.resolve();
  }

  setCustomData() {
    this.source2 = new LocalDataSource();
    this.source2.load([
      {
        service: this.translate.instant('bank_accounts_component.text8'),
        count: '1',
        price: '5000',
        summ: '5000'
      },
      {
        service: this.translate.instant('bank_accounts_component.text9'),
        count: '0',
        price: '0',
        summ: '0'
      },
      ,
      {
        service: this.translate.instant('bank_accounts_component.text10'),
        count: '0',
        price: '0',
        summ: '0'
      },
      ,
      {
        service: this.translate.instant('bank_accounts_component.text11'),
        count: '0',
        price: '0',
        summ: '0'
      },
      ,
      {
        service: this.translate.instant('bank_accounts_component.text12'),
        count: '3',
        price: '15',
        summ: '45'
      },
      ,
      {
        service: this.translate.instant('bank_accounts_component.text13'),
        count: '0',
        price: '0',
        summ: '0'
      },
      ,
      {
        service: this.translate.instant('bank_accounts_component.text14'),
        count: '0',
        price: '0',
        summ: '0'
      },
      ,
      {
        service: this.translate.instant('bank_accounts_component.text15'),
        count: '3',
        price: '0',
        summ: '0'
      },
      ,
      {
        service: this.translate.instant('bank_accounts_component.text16'),
        count: '0',
        price: '0',
        summ: '0'
      },
      ,
      {
        service: this.translate.instant('bank_accounts_component.text17'),
        count: '0',
        price: '0',
        summ: '0'
      },
      ,
      {
        service: this.translate.instant('bank_accounts_component.text18'),
        count: '0',
        price: '0',
        summ: '0'
      },
    ])
  }

  setSettingsGrid() {
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
        date: {
          title: this.translate.instant('bank_accounts_component.text19'),
          valuePrepareFunction: (date) => {
            if(date)
              return this.datePipe.transform(new Date(date), 'dd-MM-yyyy');
            else
              return '';
          }
        },
        period: {
          title: this.translate.instant('bank_accounts_component.text20'),
          valuePrepareFunction: (period) => {
            if(period)
              return this.datePipe.transform(new Date(period), 'dd-MM-yyyy');
            else
              return '';
          }
        },      
        summ: {
          title: this.translate.instant('bank_accounts_component.text21'),
          type: 'string',
        }
      },
    };
    if(this.role == 'cop_manager') {
      this.settings2 = {
        pager:{perPage: this.pagerSize},
        hideSubHeader: true,
        actions:{
          add: false,
          edit: true,
          delete: false,
        },
        mode: 'external',
        edit: {
          editButtonContent: '<i class="nb-edit"></i>',
          saveButtonContent: '<i class="nb-checkmark"></i>',
          cancelButtonContent: '<i class="nb-close"></i>',
          confirmSave: true
        },
        columns: {
          service: {
            title: this.translate.instant('bank_accounts_component.text22'),
            type: 'string',
          },
          count: {
            title: this.translate.instant('bank_accounts_component.text23'),
            type: 'string'
          },
          price: {
            title: this.translate.instant('bank_accounts_component.text24'),
            type: 'string'
          },
          summ: {
            editable: false,
            title: this.translate.instant('bank_accounts_component.text25'),
            type: 'string'
          }
        },
      };
    } else {
      this.settings2 = {
        pager:{perPage: this.pagerSize},
        hideSubHeader: true,
        actions:{
          add: false,
          edit: false,
          delete: false,
        },
        columns: {
          service: {
            title: this.translate.instant('bank_accounts_component.text22'),
            type: 'string',
          },
          count: {
            title: this.translate.instant('bank_accounts_component.text23'),
            type: 'string'
          },
          price: {
            title: this.translate.instant('bank_accounts_component.text24'),
            type: 'string'
          },
          summ: {
            title: this.translate.instant('bank_accounts_component.text25'),
            type: 'string'
          }
        },
      };
    }
  }

}
