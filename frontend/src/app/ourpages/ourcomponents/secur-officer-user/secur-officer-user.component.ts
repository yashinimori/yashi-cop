import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { DatePipe } from '@angular/common';
import { TransferService } from '../../../share/services/transfer.service';
import { HttpService } from '../../../share/services/http.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FieldsStatus } from '../../../share/models/fieldsStatus.model';
import { BankUser } from '../../../share/models/bank-user.model';
import { ErrorService } from '../../../share/services/error.service';

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
    private httpServise: HttpService, private errorService: ErrorService) {
    this.logsData = new Array<BankUser>();
    this.userData = new BankUser();
  }

  bankUsersSubscription: Subscription = new Subscription();
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    this.userId = this.transferService.userID.getValue();
    this.bankID = this.transferService.bankID.getValue();
    this.generateStatusFields();
    this.setSettingsGridLogs(this.role);
    this.getLogsData(this.userId);
    this.getUserData(this.userId); 
  }
  
  generateStatusFields() {
    this.fieldsStatus = new FieldsStatus();
    this.fieldsStatus.setStatusByRole(this.role);
  }
  
  ngOnDestroy(): void {
    this.bankUsersSubscription.unsubscribe();
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    //this.transferService.bankID.next('');
  }

  setSettingsGridLogs(role:string){
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
             id: {
               title: 'ID',
               type: 'string',
            },
            action_time: {
              title: 'Дата',
              valuePrepareFunction: (action_time) => {
                if(action_time)
                  return this.datePipe.transform(new Date(action_time), 'dd-MM-yyyy hh:mm:ss');
                else
                  return '';
              }
            },
            change_message: {
              title: 'Повідомленя',
              type: 'string',
           },
            ip: {
              title: 'IP',
              type: 'string',
           },
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
    this.logsData = new Array<BankUser>();
    let self = this;
    let pageSize = 0;
    let pageNumber = 0;
    this.bankUsersSubscription = this.httpServise.getLoggerList(id,pageSize, pageNumber).subscribe({
      next: (response: any) => {
        let data: any;
        if(pageSize > 0 && pageNumber > 0)
          data = response.results;
        else
          data = response;

          self.logsData = data;
        
        self.sourceLogs = new LocalDataSource();
        self.sourceLogs.load(self.logsData);
      },
      error: error => {
        this.errorService.handleError(error);
        console.error('There was an error!', error);
      },
      complete: () => {
      }
    });
  }

  getUserData(userId: any) {
    this.userData = new BankUser();
    let self = this;
    this.subscription1 = this.httpServise.getBankEmployees(userId).subscribe({
      next: (response: any) => {
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
        this.errorService.handleError(error);
        console.error('There was an error!', error);
      },
      complete: () => {
      }
    });
  }

  goBack(){
    this.transferService.bankID.next(this.bankID);
    this.router.navigate(['cop', 'cabinet', 'secur-officer']);
  }

  sendMail(){
    let d = {
      "email": this.userData.email
    };
    this.subscription2 = this.httpServise.sendEmailResetPass(d).subscribe({
      next: (response: any) => {
      },
      error: error => {
        this.errorService.handleError(error);
        console.error('There was an error!', error);
      },
      complete: () => {
      }
    });
  }
}
