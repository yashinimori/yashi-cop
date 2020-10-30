import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { TransferService } from '../../../share/services/transfer.service';
import { HttpService } from '../../../share/services/http.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Bank } from '../../../share/models/bank.model';
import { FieldsStatus } from '../../../share/models/fieldsStatus.model';
import { BankUser } from '../../../share/models/bank-user.model';
import { MerchUser } from '../../../share/models/merch-user.model';

@Component({
  selector: 'ngx-secur-officer',
  templateUrl: './secur-officer.component.html',
  styleUrls: ['./secur-officer.component.scss']
})
export class SecurOfficerComponent implements OnInit, OnDestroy {
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

  constructor(private transferService: TransferService,
    private router: Router,
    private httpServise: HttpService) {
    this.bank = new Bank();
    this.bankUserData = new Array<BankUser>();
    this.bankMerchData = new Array<MerchUser>();
  }

  bankUsersSubscription: Subscription = new Subscription();
  subscription1: Subscription = new Subscription();

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    this.userId = localStorage.getItem('user_id');
    this.bankID = this.transferService.bankID.getValue();
    this.generateStatusFields();
    this.setSettingsGridBankUser(this.role); 
    this.getBankEmployees(this.userId);
  }
  
  getBankEmployees(userId: any){
    this.subscription1 = this.httpServise.getBankEmployees(Number(userId)).subscribe({
      next: (response: any) => {
        if(response && response['length'] ){
          let data = response[0];
          this.bankID = data.bank.id;
          this.getBankUserData(this.bankID);
        }
      }
    });
  }
 
  createBankUser(){
    this.transferService.bankID.next(this.bankID);
    this.router.navigate(['cop', 'cabinet', 'bank-user']);
  }

  generateStatusFields() {
    this.fieldsStatus = new FieldsStatus();
    this.fieldsStatus.setStatusByRole(this.role);
  }
  
  ngOnDestroy(): void {
    this.bankUsersSubscription.unsubscribe();
    this.subscription1.unsubscribe();
    //this.transferService.bankID.next('');
  }

  setSettingsGridBankUser(role:string){
    switch(role){
      case 'security_officer': {
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
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
      }
    });
  }

  onUserRowSelect(event): void {
    this.transferService.userID.next(event.data.id);
    this.router.navigate(['cop', 'cabinet', 'secur-officer-user']);
  }
}
