import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'ngx-bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.scss']
})
export class BankAccountsComponent implements OnInit {

  constructor(private datePipe: DatePipe,) { }

  settings: any;
  source: LocalDataSource;
  settings2: any;
  source2: LocalDataSource;
  role: string;
  pagerSize = 10;

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    this.setSettingsGrid();
    this.setCustomData();
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
        service: 'Ліцензія',
        count: '1',
        price: '5000',
        summ: '5000'
      },
      {
        service: 'Імплементація',
        count: '0',
        price: '0',
        summ: '0'
      },
      ,
      {
        service: 'Плата за користувачів',
        count: '0',
        price: '0',
        summ: '0'
      },
      ,
      {
        service: 'Плата за користувачів понад пакет',
        count: '0',
        price: '0',
        summ: '0'
      },
      ,
      {
        service: 'Зареєстровано транзакцій',
        count: '3',
        price: '15',
        summ: '45'
      },
      ,
      {
        service: 'Mediation',
        count: '0',
        price: '0',
        summ: '0'
      },
      ,
      {
        service: 'Mediation понад пакет',
        count: '0',
        price: '0',
        summ: '0'
      },
      ,
      {
        service: 'Us-On-Us',
        count: '3',
        price: '0',
        summ: '0'
      },
      ,
      {
        service: 'Us-On-Us понад пакет',
        count: '0',
        price: '0',
        summ: '0'
      },
      ,
      {
        service: 'Торговців',
        count: '0',
        price: '0',
        summ: '0'
      },
      ,
      {
        service: 'Торговців понад пакет',
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
          title: 'Дата',
          valuePrepareFunction: (date) => {
            if(date)
              return this.datePipe.transform(new Date(date), 'dd-MM-yyyy');
            else
              return '';
          }
        },
        period: {
          title: 'Період',
          valuePrepareFunction: (period) => {
            if(period)
              return this.datePipe.transform(new Date(period), 'dd-MM-yyyy');
            else
              return '';
          }
        },      
        summ: {
          title: "Сума",
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
            title: 'Послуга',
            type: 'string',
          },
          count: {
            title: 'Кількість',
            type: 'string'
          },
          price: {
            title: 'Вартість',
            type: 'string'
          },
          summ: {
            editable: false,
            title: 'Всього',
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
            title: 'Послуга',
            type: 'string',
          },
          count: {
            title: 'Кількість',
            type: 'string'
          },
          price: {
            title: 'Вартість',
            type: 'string'
          },
          summ: {
            title: 'Всього',
            type: 'string'
          }
        },
      };
    }
  }

}
