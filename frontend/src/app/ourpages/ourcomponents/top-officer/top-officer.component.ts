import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { TransferService } from '../../../share/services/transfer.service';
import { HttpService } from '../../../share/services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Bank } from '../../../share/models/bank.model';
import { FieldsStatus } from '../../../share/models/fieldsStatus.model';
import { BankUser } from '../../../share/models/bank-user.model';
import { MerchUser } from '../../../share/models/merch-user.model';
import { ErrorService } from '../../../share/services/error.service';
import { API, APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table';

@Component({
  selector: 'ngx-top-officer',
  templateUrl: './top-officer.component.html',
  styleUrls: ['./top-officer.component.scss']
})
export class TopOfficerComponent implements OnInit, OnDestroy {
  role: string;
  pagerSize = 10;
  bankID: any;
  fieldsStatus: FieldsStatus;
  bank: Bank;
  bankUserData: Array<BankUser>;
  settingsBankUser: any;
  sourceBankUser: LocalDataSource;
  bankMerchData: Array<MerchUser>;
  settingsMerch: any;
  sourceMerch: LocalDataSource;
  userId: any;
  routeParamsStatus: any;

  constructor(private transferService: TransferService,
    private router: Router,
    private httpServise: HttpService,
    private errorService: ErrorService,
    private activatedRoute: ActivatedRoute,) {
    this.bank = new Bank();
    this.bankUserData = new Array<BankUser>();
    this.bankMerchData = new Array<MerchUser>();
  }

  @ViewChild('table', { static: true }) table: APIDefinition;
  @ViewChild('table2', { static: true }) table2: APIDefinition;

  public configuration1: Config;
  public configuration2: Config;

  public columns1: Columns[] = [
    {key: 'userId', title: 'Користувач'},
    {key: 'role', title: 'Роль'},
    {key: 'first_name', title: "Ім'я"},
    {key: 'last_name', title: 'Прізвище'},
    {key: 'unit', title: "Підрозділ"},
    {key: 'phone', title: 'Телефон'},
    {key: 'email', title: 'Пошта'},
    {key: 'registration_date', title: 'Реєстрація'}
  ];
  public columns2: Columns[] = [
    {key: 'merch_id', title: 'Merchant ID'},
    {key: 'name_legal', title: 'Юридична назва'},
    {key: 'mcc', title: 'MCC'},
    {key: 'description', title: 'Вид діяльності'},
    {key: 'phone', title: "Телефон"},
    {key: 'email', title: 'Пошта'},
    {key: 'name_ips', title: 'Назва торговця в МПС'},
    {key: 'address', title: 'Адреса'},
    {key: 'term_id', title: 'Terminal ID'},
    {key: 'contact_person', title: 'Контактна особа'}
  ];
  public dataTable1 = new Array();
  public dataTable2 = new Array();
  public pagination1 = {
    limit: 10,
    offset: 0,
    count: -1,
    sort: '',
    order: '',
  };
  public pagination2 = {
    limit: 10,
    offset: 0,
    count: -1,
    sort: '',
    order: '',
  };

  bankUsersSubscription: Subscription = new Subscription();
  merchListSubscription: Subscription = new Subscription();
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  subscription3: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscription3 = this.activatedRoute.params.subscribe(routeParams => {
      this.routeParamsStatus = routeParams.status;
      this.role = localStorage.getItem('role');
      this.userId = localStorage.getItem('user_id');
      this.bankID = this.transferService.bankID.getValue();
      this.generateStatusFields();
      // this.setSettingsGridBankUser(this.role);
      // this.setSettingsGridMerch(this.role);
      this.bankUserData = new Array<BankUser>();
      this.bankMerchData = new Array<MerchUser>();
      this.setSettingsForTable();
      this.subscription1 = this.httpServise.getBankEmployees(Number(this.userId)).subscribe({
        next: (response: any) => {
          if(response && response['length'] ){
            let data = response[0];
            this.bankID = data.bank.id;
            this.transferService.bankID.next(this.bankID);
            this.bank = new Bank();
            // this.getBankData(this.bankID);  
            if(this.routeParamsStatus == 'users') {
              this.getBankUserData(this.bankID);
            } else {
              this.getMerchantData(this.bankID);
            }
          }
        },
        error: (error: any) => {
          this.errorService.handleError(error);
        }
      });
    });
  }

  setSettingsForTable() {
    this.configuration1 = { ...DefaultConfig };
    this.configuration1.columnReorder = true;
    this.configuration1.orderEnabled = true;
    this.configuration1.threeWaySort = true;
    this.configuration1.selectRow = true;
    this.configuration1.searchEnabled = true;
    this.configuration1.persistState = true;
    this.configuration1.resizeColumn = true;
    this.configuration1.fixedColumnWidth = false;
    this.configuration1.tableLayout.striped = true;
    this.configuration1.tableLayout.style = 'tiny';
    this.configuration2 = { ...DefaultConfig };
    this.configuration2.columnReorder = true;
    this.configuration2.orderEnabled = true;
    this.configuration2.threeWaySort = true;
    this.configuration2.selectRow = true;
    this.configuration2.searchEnabled = true;
    this.configuration2.persistState = true;
    this.configuration2.resizeColumn = true;
    this.configuration2.fixedColumnWidth = false;
    this.configuration2.tableLayout.striped = true;
    this.configuration2.tableLayout.style = 'tiny';
    // this.configuration.isLoading = true;
  }
  
  createBankUser(){
    this.transferService.bankID.next(this.bankID);
    this.router.navigate(['cop', 'cabinet', 'bank-user']);
  }

  createMerch(){
    this.transferService.bankID.next(this.bankID);
    this.router.navigate(['cop', 'cabinet', 'merch-user']);
  }

  generateStatusFields() {
    this.fieldsStatus = new FieldsStatus();
    this.fieldsStatus.setStatusByRole(this.role);
  }
  
  getBankData(id: any) {
    this.bank = new Bank();
    let self = this;
    let pageSize = 0;
    let pageNumber = 0;
    this.subscription2 = this.httpServise.getBank(id).subscribe({
      next: (response: any) => {
        this.bank.id = response['id'];
        this.bank.bin = response['bin'];
        this.bank.type = response['type'];
        this.bank.name_eng = response['name_eng'];
        this.bank.name_uk = response['name_uk'];
        this.bank.name_rus = response['name_rus'];
        this.bank.operator_name = response['operator_name'];
        this.bank.contact_person = response['contact_person'];
        this.bank.contact_telephone = response['contact_telephone'];
        this.bank.contact_email = response['contact_email'];
      },
      error: error => {
        this.errorService.handleError(error);
        console.error('There was an error!', error);
      },
      complete: () => {  
      }
    });
  }

  ngOnDestroy(): void {
    this.bankUsersSubscription.unsubscribe();
    this.merchListSubscription.unsubscribe();
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    //this.transferService.bankID.next('');
  }

  setSettingsGridBankUser(role:string){
    switch(role){
      case 'top_level': {
        this.settingsBankUser = {
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
            userId: {
              title: 'Користувач',
              type: 'string',
            },
            role: {
              title: 'Роль',
              type: 'string',
            },
            first_name: {
              title: 'Імя',
              type: 'string',
            },
            last_name: {
              title: 'Прізвище',
              type: 'string',
            },
            unit: {
              title: 'Підрозділ',
              type: 'string',
            },
            phone: {
              title: 'Телефон',
              type: 'string',
            },
            email: {
              title: 'Пошта',
              type: 'string',
            },
            registration_date:{
              title: 'Регістрація',
              type: 'string',
  
            }
          },
        };
      }
      break;
      default:{
        this.settingsBankUser = {
          actions:{
            add: false,
            edit: false,
            delete: false,
          },
        };
      }
    }
  }

  getBankUserData(id: any) {
    this.configuration1.isLoading = true;
    this.bankUserData = new Array<BankUser>();
    let self = this;
    let pageSize = 0;
    let pageNumber = 0;
    this.bankUsersSubscription = this.httpServise.getBankUsersList(id,pageSize, pageNumber).subscribe({
      next: (response: any) => {
        let data: any;
        if(pageSize > 0 && pageNumber > 0)
          data = response.results;
        else
          data = response;

        data.forEach(el => {
          let t = new BankUser();
          let user = el['user'];
          
          t.id = user['id'];
          t.first_name = user['first_name'];
          t.last_name = user['last_name'];
          t.email = user['email'];
          t.phone = user['phone'];
          t.role = user['role'];
          t.userId = user['userId'];
          t.unit = el['unit'];
          t.registration_date = user['registration_date'];

          self.bankUserData.push(t);
        });
        self.sourceBankUser = new LocalDataSource();
        self.sourceBankUser.load(self.bankUserData);
        this.dataTable1 = self.bankUserData;
      },
      error: error => {
        this.errorService.handleError(error);
        console.error('There was an error!', error);
      },
      complete: () => { 
        this.configuration1.isLoading = false;
      }
    });
  }

  setSettingsGridMerch(role:string){
    switch(role){
      case 'top_level': {
        this.settingsMerch = {
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
            // first_name: {
            //   title: 'Імя',
            //   type: 'string',
            // },
            // last_name: {
            //   title: 'Прізвище',
            //   type: 'string',
            // },
            merch_id: {
              title: 'Merchant ID',
              type: 'string',
            },
            name_legal: {
              title: 'Юридична назва',
              type: 'string',
            },
            mcc: {
              title: 'MCC',
              type: 'string',
            },
            description: {
              title: 'Вид діяльності',
              type: 'string',
            },
            phone: {
              title: 'Телефон',
              type: 'string',
            },
            email: {
              title: 'Пошта',
              type: 'string',
            },
            name_ips: {
              title: 'Назва торговця в МПС',
              type: 'string',
            },
            address: {
              title: 'Адрес',
              type: 'string',
            },
            term_id: {
              title: 'Terminal ID',
              type: 'string',
            },
            contact_person: {
              title: 'Контактна особа',
              type: 'string',
            },
      
          },
        };
      }
      break;
      default: {
        this.settingsMerch = {
          actions:{
            add: false,
            edit: false,
            delete: false,
          },
        };
      }
    }
  }

  getMerchantData(id: any) {
    this.configuration2.isLoading = true;
    this.bankMerchData = new Array<MerchUser>();
    let self = this;
    let pageSize = 0;
    let pageNumber = 0;
    this.merchListSubscription = this.httpServise.getMerchList(id,pageSize, pageNumber).subscribe({
      next: (response: any) => {
        let data: any;
        if(pageSize > 0 && pageNumber > 0)
          data = response.results;
        else
          data = response;

        data.forEach(el => {
          let t = new MerchUser();
    
          t.id = el['id'];
          t.first_name = el['first_name'];
          t.last_name = el['last_name'];
          t.email = el['email'];
          t.phone = el['phone'];
          t.role = el['role'];
          t.merch_id = el['merch_id'];
          t.name_legal = el['name_legal'];
          t.mcc = el['mcc'];
          t.description = el['description'];
          t.name_ips = el['name_ips'];
          t.address = el['address'];
          t.term_id = el['term_id'];
          t.contact_person = el['contact_person'];

          self.bankMerchData.push(t);
        });
        self.sourceMerch = new LocalDataSource();
        self.sourceMerch.load(self.bankMerchData);
        this.dataTable2 = self.bankMerchData;
      },
      error: error => {
        this.errorService.handleError(error);
        console.error('There was an error!', error);
      },
      complete: () => {
        this.configuration2.isLoading = false;
      }
    });
  }

  goStatistic(){
    this.transferService.bankID.next(this.bankID);
    this.router.navigate(['cop', 'cabinet', 'bank-statistic']);
  }
}
