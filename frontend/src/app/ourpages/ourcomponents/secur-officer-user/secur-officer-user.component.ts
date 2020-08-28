import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';
import { DatePipe } from '@angular/common';
import { TransferService } from '../../../share/services/transfer.service';
import { HttpService } from '../../../share/services/http.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Bank } from '../../../share/models/bank.model';
import { FieldsStatus } from '../../../share/models/fieldsStatus.model';
import { BankUser } from '../../../share/models/bank-user.model';

@Component({
  selector: 'ngx-secur-officer-user',
  templateUrl: './secur-officer-user.component.html',
  styleUrls: ['./secur-officer-user.component.scss']
})
export class SecurOfficerUserComponent implements OnInit, OnDestroy {
  role: string;
  pagerSize = 10;
  bankID: any;
  fieldsStatus: FieldsStatus;
  logsData: Array<BankUser>;
  settingsLogs: any;
  sourceLogs: LocalDataSource;
  userId: any;
  userData: BankUser;

  constructor(private datePipe: DatePipe, 
    private transferService: TransferService,
    private router: Router,
    private httpServise: HttpService) {
    
    this.logsData = new Array<BankUser>();
    this.userData = new BankUser();

  }

  bankUsersSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    
    this.role = localStorage.getItem('role');
    console.log('BankSingleComponent role ' +this.role);
    
    this.userId = this.transferService.userID.getValue();
    console.log('BankSingleComponent userId ' +this.userId);

    this.bankID = this.transferService.bankID.getValue();
    console.log('this.bankID = ' + this.bankID);

    this.generateStatusFields();

    this.setSettingsGridLogs(this.role);
    //this.getLogsData(this.userId);

    this.getUserData(this.userId);
    
  }
  
  generateStatusFields() {
    this.fieldsStatus = new FieldsStatus();
    this.fieldsStatus.setStatusByRole(this.role);
    console.log(this.fieldsStatus);
  }
  
  ngOnDestroy(): void {
    this.bankUsersSubscription.unsubscribe();
    //this.transferService.bankID.next('');
  }

  setSettingsGridLogs(role:string){
    console.log('setSettingsGridBankUser()' + role);

    switch(role){
      case 'security_officer': {
        this.settingsLogs = {
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
        this.settingsLogs = {
          actions:{
            add: false,
            edit: false,
            delete: false,
          },
        };
      }
    }
        
  }

  getLogsData(id: any) {
    console.log('getLogsData()');
    this.logsData = new Array<BankUser>();

    let self = this;
    let pageSize = 0;
    let pageNumber = 0;
    this.bankUsersSubscription = this.httpServise.getBankUsersList(id,pageSize, pageNumber).subscribe({
      next: (response: any) => {
        console.log('loaded logs '); 
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

          self.logsData.push(t);
          
          console.log(t);

        });
        
        self.sourceLogs = new LocalDataSource();
        self.sourceLogs.load(self.logsData);

        console.log(self.sourceLogs);
        
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
       
      }
    });
  }

  getUserData(userId: any) {
    
    this.userData = new BankUser();

    let self = this;
    this.httpServise.getBankEmployees(userId).subscribe({
      next: (response: any) => {
        console.log('loaded user'); 
        console.log(response);
        this.userData.id = response[0].user.id;
        this.userData.first_name = response[0].user.first_name;
        this.userData.last_name = response[0].user.last_name;
        this.userData.phone = response[0].user.phone;
        this.userData.email = response[0].user.email;
        this.userData.role = response[0].user.role;
        this.userData.unit = response[0].user.unit;
        this.userData.email = response[0].user.email;
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
    
      }
    });
  }


  goBack(){
    this.transferService.bankID.next(this.bankID);
    this.router.navigate(['ourpages', 'ourcomponents', 'secur-officer']);
  }

  sendMail(){
    let d = {
      "email": this.email
    };
    this.httpServise.sendEmailResetPass(d).subscribe({
      next: (response: any) => {
        console.log('sent email'); 
        console.log(response);
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
    
      }
    });

  }

}
