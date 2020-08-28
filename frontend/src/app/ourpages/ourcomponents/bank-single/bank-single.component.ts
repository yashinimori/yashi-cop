import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';
import { ClaimView } from '../../../share/models/claim-view.model';
import { DatePipe } from '@angular/common';
import { TransferService } from '../../../share/services/transfer.service';
import { HttpService } from '../../../share/services/http.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Bank } from '../../../share/models/bank.model';
import { FieldsStatus } from '../../../share/models/fieldsStatus.model';
import { BankUser } from '../../../share/models/bank-user.model';
import { MerchUser } from '../../../share/models/merch-user.model';

@Component({
  selector: 'ngx-bank-single',
  templateUrl: './bank-single.component.html',
  styleUrls: ['./bank-single.component.scss']
})
export class BankSingleComponent implements OnInit, OnDestroy {
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

  constructor(private datePipe: DatePipe, 
    private transferService: TransferService,
    private router: Router,
    private httpServise: HttpService) {
    this.bank = new Bank();
    this.bankUserData = new Array<BankUser>();
    this.bankMerchData = new Array<MerchUser>();
  }

  bankUsersSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    
    this.role = localStorage.getItem('role');
    console.log('BankSingleComponent role ' +this.role);

    this.bankID = this.transferService.bankID.getValue();
    console.log('this.bankID = ' + this.bankID);

    this.bank = new Bank();
    this.getBankData(this.bankID);

    this.generateStatusFields();

    this.setSettingsGridBankUser(this.role);
    this.getBankUserData(this.bankID);
    
    this.setSettingsGridMerch(this.role);
    this.getMerchantData(this.bankID);
    
  }
  
  createBankUser(){
    this.transferService.bankID.next(this.bankID);
    this.router.navigate(['ourpages', 'ourcomponents', 'bank-user']);
  }

  createMerch(){
    this.transferService.bankID.next(this.bankID);
    this.router.navigate(['ourpages', 'ourcomponents', 'merch-user']);
  }

  generateStatusFields() {
    this.fieldsStatus = new FieldsStatus();
    this.fieldsStatus.setStatusByRole(this.role);
    console.log(this.fieldsStatus);
  }
  
  getBankData(id: any) {
    console.log('loadBanks()');
    this.bank = new Bank();

    let self = this;
    let pageSize = 0;
    let pageNumber = 0;
    this.httpServise.getBank(id).subscribe({
      next: (response: any) => {
        console.log('loaded bank '); 
        console.log(response);

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
        console.error('There was an error!', error);
      },
      complete: () => {
       
      }
    });
  }

  ngOnDestroy(): void {
    this.bankUsersSubscription.unsubscribe();
    //this.transferService.bankID.next('');
  }


  setSettingsGridBankUser(role:string){
    console.log('setSettingsGridBankUser(c:string)' + role);

    switch(role){
      case 'admin':
      case 'cop_manager':
      case 'chargeback_officer':  {
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
      default: {
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
    console.log('getBankUserData()');
    this.bankUserData = new Array<BankUser>();

    let self = this;
    let pageSize = 0;
    let pageNumber = 0;
    this.bankUsersSubscription = this.httpServise.getBankUsersList(id,pageSize, pageNumber).subscribe({
      next: (response: any) => {
        console.log('loaded bank users '); 
        console.log(response);

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
          
          console.log(t);

        });
        
        self.sourceBankUser = new LocalDataSource();
        self.sourceBankUser.load(self.bankUserData);

        console.log(self.sourceBankUser);
        
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
       
      }
    });
  }


  setSettingsGridMerch(role:string){
    console.log('setSettingsGridMerchant(c:string)' + role);

    switch(role){
      case 'admin':
      case 'cop_manager':
      case 'chargeback_officer':  {
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
            first_name: {
              title: 'Імя',
              type: 'string',
            },
            last_name: {
              title: 'Прізвище',
              type: 'string',
            },
            merch_id: {
              title: 'Merchant ID',
              type: 'string',
            },
            name_legal: {
              title: 'юридична назва',
              type: 'string',
            },
            mcc: {
              title: 'MCC',
              type: 'string',
            },
            description: {
              title: 'вид діяльності',
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
              title: 'назва торговця в МПС',
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
              title: 'контактна особа',
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
    console.log('getMerchantData()');
    this.bankMerchData = new Array<MerchUser>();

    let self = this;
    let pageSize = 0;
    let pageNumber = 0;
    this.bankUsersSubscription = this.httpServise.getMerchList(id,pageSize, pageNumber).subscribe({
      next: (response: any) => {
        console.log('loaded merch users '); 
        console.log(response);

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
          
          console.log(t);

        });
        
        self.sourceMerch = new LocalDataSource();
        self.sourceMerch.load(self.bankMerchData);

        console.log(self.sourceBankUser);
        
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
       
      }
    });
  }


}