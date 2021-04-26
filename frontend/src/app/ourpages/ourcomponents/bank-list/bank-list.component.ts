import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { TransferService } from '../../../share/services/transfer.service';
import { HttpService } from '../../../share/services/http.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Bank } from '../../../share/models/bank.model';
import { API, APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { ErrorService } from '../../../share/services/error.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

interface EventObject {
  event: string;
  value: {
    limit: number;
    page: number;
    key: string;
    order: string;
  };
}

@Component({
  selector: 'ngx-bank-list',
  templateUrl: './bank-list.component.html',
  styleUrls: ['./bank-list.component.scss']
})
export class BankListComponent implements OnInit, OnDestroy {
  banksData: Array<Bank>;
  settings: any;
  source: LocalDataSource;
  role: string;
  pagerSize = 10;

  constructor(private transferService: TransferService,
    private router: Router, private translate: TranslateService,
    private httpServise: HttpService, private errorService: ErrorService) {
    this.banksData = new Array<Bank>();
  }

  @ViewChild('table', { static: true }) table: APIDefinition;

  banksSubscription: Subscription = new Subscription();
  translationChangeSubscription: Subscription = new Subscription();
  isUiLoad:boolean = false;

  public configuration: Config;
  public columns: Columns[];
  public data = new Array();
  checked = new Set(['bin', 'type', 'name_eng', 'name_uk', 'name_rus',
   'operator_name', 'contact_person', 'contact_telephone', 'contact_email']);
  columnsCopy: Columns[] = [];
  public pagination = {
    limit: 10,
    offset: 0,
    count: -1,
    sort: '',
    order: '',
  };

  ngOnInit(): void {
    this.translationChangeSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.setSettingsForTable();
      this.setSettingsGrid(this.role);
      this.getBanksData();
    });
    this.setSettingsForTable();
    // ... etc.
    // this.columns = [
    //   { key: 'phone', title: 'Phone' },
    //   { key: 'age', title: 'Age' },
    //   { key: 'company', title: 'Company' },
    //   { key: 'name', title: 'Name' },
    //   { key: 'isActive', title: 'STATUS' },
    // ];
    this.columns = [
      {key: 'bin', title: this.translate.instant('bank_list_component.text11')},
      {key: 'type', title: this.translate.instant('bank_list_component.text12')},
      {key: 'name_eng', title: this.translate.instant('bank_list_component.text13')},
      {key: 'name_uk', title: this.translate.instant('bank_list_component.text14')},
      {key: 'name_rus', title: this.translate.instant('bank_list_component.text15')},
      {key: 'operator_name', title: this.translate.instant('bank_list_component.text16')},
      {key: 'contact_person', title: this.translate.instant('bank_list_component.text17')},
      {key: 'contact_telephone', title: this.translate.instant('bank_list_component.text18')},
      {key: 'contact_email', title: this.translate.instant('bank_list_component.text19')},
    ];
    this.columnsCopy = this.columns;
    this.parsePagination();
    
    this.role = localStorage.getItem('role');
    this.setSettingsGrid(this.role);
    this.getBanksData();
    //this.hideColumnForUser(this.role);
  }

  setSettingsForTable() {
    this.configuration = { ...DefaultConfig };
    this.configuration.columnReorder = true;
    this.configuration.orderEnabled = true;
    this.configuration.threeWaySort = true;
    this.configuration.selectRow = true;
    this.configuration.searchEnabled = true;
    this.configuration.persistState = true;
    this.configuration.resizeColumn = true;
    this.configuration.fixedColumnWidth = false;
    this.configuration.tableLayout.striped = true;
    this.configuration.tableLayout.style = 'tiny';
    this.configuration.isLoading = true;
  }

  clickSettings() {
  }

  toggle(name: string): void {
    this.checked.has(name) ? this.checked.delete(name) : this.checked.add(name);
    this.columns = this.columnsCopy.filter((column) => this.checked.has(column.key));
  }

  onUserRowSelect(event): void {
    if(localStorage.getItem('activeTab')) {
      localStorage.removeItem('activeTab');
    }
    this.transferService.bankID.next(event.data.id);
    this.transferService.bankBIN.next(event.data.bin);
    this.router.navigate(['cop', 'cabinet', 'bank-single']);
  }

  // hideColumnForUser(role:string){
  //   if(role && (role == 'cardholder' || role == 'user')){
  //       delete this.settings.columns.id;
  //   }
  // }

  onChange(name: string): void {
    this.table.apiEvent({
      type: API.onGlobalSearch,
      value: name,
    });
  }

  eventEmitted($event: { event: string; value: any }): void {
    switch($event.event) {
      case 'onClick':
        if(localStorage.getItem('activeTab')) {
          localStorage.removeItem('activeTab');
        }
        this.transferService.bankID.next($event.value.row.id);
        this.transferService.bankBIN.next($event.value.row.bin);
        this.router.navigate(['cop', 'cabinet', 'bank-single']);
        break;
      case 'onPagination':
        break;
    }
  }

  parsePagination(): void {
    let onOrder = localStorage.getItem('onOrder');
    if(onOrder) {
      let parsedOnOrder = JSON.parse(onOrder);
      this.pagination.sort = parsedOnOrder.key ? parsedOnOrder.key : this.pagination.sort;
      this.pagination.order = parsedOnOrder.order ? parsedOnOrder.order : this.pagination.order;
    }
    // this.pagination.limit = obj.value.limit ? obj.value.limit : this.pagination.limit;
    // this.pagination.offset = obj.value.page ? obj.value.page : this.pagination.offset;
    // this.pagination.sort = !!obj.value.key ? obj.value.key : this.pagination.sort;
    // this.pagination.order = !!obj.value.order ? obj.value.order : this.pagination.order;
    // this.pagination = { ...this.pagination };
    // const pagination = `_limit=${this.pagination.limit}&_page=${this.pagination.offset}`;
    // const sort = `&_sort=${this.pagination.sort}&_order=${this.pagination.order}`;
    
  }
  
  setSettingsGrid(role:string){
    switch(role){
      case 'admin':
      case 'cop_manager':
      case 'chargeback_officer':  {
        this.settings = {
          pager:{perPage: this.pagerSize},
          //hideSubHeader: true,
          actions:{
            add: false,
            edit: false,
            delete: false,
          },
          columns: {
            // id: {
            //   title: 'ID',
            //   type: 'string',
            // },
            bin: {
              title: this.translate.instant('bank_list_component.text11'),
              type: 'string',
            },
            type: {
              title: this.translate.instant('bank_list_component.text12'),
              type: 'string',
            },
            name_eng: {
              title: this.translate.instant('bank_list_component.text13'),
              type: 'string',
            },
            name_uk: {
              title: this.translate.instant('bank_list_component.text14'),
              type: 'string',
            },
            name_rus: {
              title: this.translate.instant('bank_list_component.text15'),
              type: 'string',
            },
            operator_name: {
              title: this.translate.instant('bank_list_component.text16'),
              type: 'string',
            },
            contact_person: {
              title: this.translate.instant('bank_list_component.text17'),
              type: 'string',
            },
            contact_telephone: {
              title: this.translate.instant('bank_list_component.text18'),
              type: 'string',
            },
            contact_email: {
              title: this.translate.instant('bank_list_component.text19'),
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

  getBanksData() {
    this.banksData = new Array<Bank>();

    let self = this;
    let pageSize = 0;
    let pageNumber = 0;
    this.banksSubscription = this.httpServise.getBankList(pageSize, pageNumber).subscribe({
      next: (response: any) => {
        let data: any;

        if(pageSize > 0 && pageNumber > 0)
          data = response.results;
        else
          data = response;
        this.data = new Array();
        data.forEach(el => {
          let t = new Bank();
    
          t.id = el['id'];
          t.bin = el['bin'];
          t.type = el['type'];
          t.name_eng = el['name_eng'];
          t.name_uk = el['name_uk'];
          t.name_rus = el['name_rus'];
          t.operator_name = el['operator_name'];
          t.contact_person = el['contact_person'];
          t.contact_telephone = el['contact_telephone'];
          t.contact_email = el['contact_email'];

          this.data.push(t);
          self.banksData.push(t);
        });
        self.source = new LocalDataSource();
        self.source.load(self.banksData);  
      },
      error: error => {
        this.errorService.handleError(error);
        this.errorService.handleErrorToast(error);
        console.error('There was an error!', error);
      },
      complete: () => {
        //this.parsePagination();
        this.configuration.isLoading = false;
        this.isUiLoad = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.banksSubscription.unsubscribe();
    this.translationChangeSubscription.unsubscribe();
  }
}
