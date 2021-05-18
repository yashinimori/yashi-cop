import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {LocalDataSource} from 'ng2-smart-table';
import {TransferService} from '../../../share/services/transfer.service';
import {HttpService} from '../../../share/services/http.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Bank} from '../../../share/models/bank.model';
import {API, APIDefinition, Columns, Config, DefaultConfig} from 'ngx-easy-table';
import {ErrorService} from '../../../share/services/error.service';

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
              private router: Router,
              private httpServise: HttpService, private errorService: ErrorService) {
    this.banksData = new Array<Bank>();
  }

  @ViewChild('table', {static: true}) table: APIDefinition;

  banksSubscription: Subscription = new Subscription();
  isUiLoad: boolean = false;

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
      {key: 'bin', title: 'BIN'},
      {key: 'type', title: 'Тип'},
      {key: 'name_eng', title: 'Назва банку англійською'},
      {key: 'name_uk', title: 'Назва банку українською'},
      {key: 'name_rus', title: 'Назва банку російською'},
      {key: 'operator_name', title: 'Операційне ім’я'},
      {key: 'contact_person', title: 'Контактна особа'},
      {key: 'contact_telephone', title: 'Контактний телефон'},
      {key: 'contact_email', title: 'Контактна пошта'},
    ];
    this.columnsCopy = this.columns;
    this.parsePagination();
    this.role = localStorage.getItem('role');
    this.setSettingsGrid(this.role);
    this.getBanksData();
    //this.hideColumnForUser(this.role);
  }

  setSettingsForTable() {
    this.configuration = {...DefaultConfig};
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
    if (localStorage.getItem('activeTab')) {
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
    switch ($event.event) {
      case 'onClick':
        if (localStorage.getItem('activeTab')) {
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
    if (onOrder) {
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

  setSettingsGrid(role: string) {
    switch (role) {
      case 'admin':
      case 'cop_manager':
      case 'chargeback_officer': {
        this.settings = {
          pager: {perPage: this.pagerSize},
          //hideSubHeader: true,
          actions: {
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
              title: 'BIN',
              type: 'string',
            },
            type: {
              title: 'Тип',
              type: 'string',
            },
            name_eng: {
              title: 'Назва банку англійською',
              type: 'string',
            },
            name_uk: {
              title: 'Назва банку українською',
              type: 'string',
            },
            name_rus: {
              title: 'Назва банку російською',
              type: 'string',
            },
            operator_name: {
              title: 'Операційне ім’я ',
              type: 'string',
            },
            contact_person: {
              title: 'Контактна особа',
              type: 'string',
            },
            contact_telephone: {
              title: 'Контактний телефон',
              type: 'string',
            },
            contact_email: {
              title: 'Контактна пошта',
              type: 'string',
            },
          },
        };
      }
        break;
      default: {
        this.settings = {
          actions: {
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

        if (pageSize > 0 && pageNumber > 0)
          data = response.results;
        else
          data = response;
        this.data = new Array();
        data.forEach(el => {
          const bank = new Bank();
          const bins = el['bins'];
          if (bins.length !== 0) {
            bank.bin = bins[0]['bin'];
          }
          bank.id = el['id'];
          bank.type = el['type'];
          bank.name_eng = el['name_eng'];
          bank.name_uk = el['name_uk'];
          bank.name_rus = el['name_rus'];
          bank.operator_name = el['operator_name'];
          bank.contact_person = el['contact_person'];
          bank.contact_telephone = el['contact_telephone'];
          bank.contact_email = el['contact_email'];
          this.data.push(bank);
          self.banksData.push(bank);
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
      }});
  }

  ngOnDestroy(): void {
    this.banksSubscription.unsubscribe();
  }
}
