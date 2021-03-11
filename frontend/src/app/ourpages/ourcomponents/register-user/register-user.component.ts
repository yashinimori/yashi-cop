import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as Papa from 'papaparse';
import { forkJoin, Subscription } from 'rxjs';
import { MerchUser } from '../../../share/models/merch-user.model';
import { ErrorService } from '../../../share/services/error.service';
import { HttpService } from '../../../share/services/http.service';
import { ToastService } from '../../../share/services/toast.service';
import { TransferService } from '../../../share/services/transfer.service';

@Component({
  selector: 'ngx-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit, OnDestroy {

  constructor( 
    private transferService: TransferService,
    private router: Router,
    private errorService: ErrorService,
    private toastService: ToastService,
    private httpServise: HttpService,
    private activatedRoute: ActivatedRoute,) { }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler($event) {
    if (this.bankID && this.bankID != 0) {
      localStorage.setItem('bankID', this.bankID);
    }
    if (this.bankBin && this.bankBin != 0) {
      localStorage.setItem('bankBIN', this.bankBin);
    }
  }

  subscription1: Subscription = new Subscription();
  subscriptionMerchants: Subscription = new Subscription();
  subscriptionAtms: Subscription = new Subscription();
  subscriptionUsers: Subscription = new Subscription();
  selectedFile: any;

  loadingCreate = false;

  merchantsArr: Array<any> = new Array<any>();
  observableArrMerchants: Array<any> = new Array<any>();

  atmsArr: Array<any> = new Array<any>();
  observableArrAtms: Array<any> = new Array<any>();

  usersArr: Array<any> = new Array<any>();
  observableArrUsers: Array<any> = new Array<any>();
  
  routeParamsStatus: any;
  role: any;
  bankID: any;
  bankBin: any;
  public dataMerchant: MerchUser;

  ngOnInit(): void {
    if(localStorage.getItem('bankID')) {
      this.bankID = localStorage.getItem('bankID');
    } else {
      this.bankID = this.transferService.bankID.getValue();
    }
    if(localStorage.getItem('bankBIN')) {
      this.bankBin = localStorage.getItem('bankBIN');
    } else {
      this.bankBin = this.transferService.bankBIN.getValue();
    }
    this.role = localStorage.getItem('role');
    this.subscription1 = this.activatedRoute.params.subscribe(routeParams => {
      this.routeParamsStatus = routeParams.status;      
    });
  }

  fileChanged(e) {
    this.selectedFile = e.target.files[0];
    Papa.parse(this.selectedFile, {
      header: true,
      complete: (results) => {
        results.data.forEach(e => {
          if(e && Object.keys(e).length > 1) {
            switch(this.routeParamsStatus) {
              case 'merchant': 
                let dataMerchant = this.parseMerchant(e);
                this.merchantsArr.push(dataMerchant);
                this.observableArrMerchants.push(this.createObservableMerchants(dataMerchant));
                break;
              case 'atm': 
                let dataAtm = this.parseAtm(e);
                this.atmsArr.push(dataAtm);
                this.observableArrAtms.push(this.createObservableAtms(dataAtm));
                break;
              case 'user': 
                let dataUser = this.parseUser(e);
                this.usersArr.push(dataUser);
                this.observableArrUsers.push(this.createObservableUsers(dataUser));
                break;
            }
          }
        });
      }
    });
  }

  // --------------------------------------- Merchant ---------------------------------------
  parseMerchant(merch:any) {
    return {
      "user": Number(localStorage.getItem('user_id')),
      "email": merch.Email,
      "password": merch.Password,
      "first_name": 'no name',
      "last_name": 'no name',
      "phone": merch.Telephone,
      "role": "merchant",
      //"merchant" : {
      "merch_id": merch.Merchant_ID,
      "name_ips": merch.Merchant_Name_IPS,
      "bank": [Number(this.bankID)],
      "name_legal": merch.Merchant_Name_Legal,
      "bin": this.bankBin,
      "mcc": merch.MCC,
      "description": merch.Description,
      "address": merch.Address,
      "contact_person": merch.Contact_Person
       // }
    } 
  }

  createObservableMerchants(data) {
    return this.httpServise.createNewUserMerch(data);
  }

  removeMerchant(index) {
    this.merchantsArr.splice(index, 1);
    this.observableArrMerchants.splice(index, 1);
    if(this.merchantsArr.length == 0) {
      this.selectedFile = undefined;
    }
  }

  createNewMerchants() {
    this.loadingCreate = true;
    this.subscriptionMerchants = forkJoin(this.observableArrMerchants).subscribe({
      next: (response: any) => {},
      error: error => {
        this.loadingCreate = false;
        this.errorService.handleError(error);
        this.errorService.handleErrorToast(error);
        console.error('There was an error!', error);
      },
      complete: () => {
        this.loadingCreate = false;
        this.merchantsArr = new Array();
        this.observableArrMerchants = new Array();
        this.selectedFile = undefined;
        this.toastService.showSuccessToast();
      }
    });
  }

  // --------------------------------------- ATM ---------------------------------------

  parseAtm(atm) {
    return {
      "merch_id": atm.merch_id,
      "name_ips": atm.name_ips,
      "bank": Number(this.bankID),
      "name_legal": atm.name_legal,
      "bin": this.bankBin,
      "mcc": atm.mcc,
      "description": atm.description,
      "address": atm.address,
      "contact_person": atm.contact_person 
    }
  }

  createObservableAtms(data) {
    return this.httpServise.createNewATM(data);
  }

  removeAtm(index) {
    this.atmsArr.splice(index, 1);
    this.observableArrAtms.splice(index, 1);
    if(this.atmsArr.length == 0) {
      this.selectedFile = undefined;
    }
  }

  createNewAtm() {
    this.loadingCreate = true;
    this.subscriptionAtms = forkJoin(this.observableArrAtms).subscribe({
      next: (response: any) => {},
      error: error => {
        this.loadingCreate = false;
        this.errorService.handleError(error);
        this.errorService.handleErrorToast(error);
        console.error('There was an error!', error);
      },
      complete: () => {
        this.loadingCreate = false;
        this.atmsArr = new Array();
        this.observableArrAtms = new Array();
        this.selectedFile = undefined;
        this.toastService.showSuccessToast();
      }
    });
  }

  // --------------------------------------- User ---------------------------------------

  parseUser(user) {
    return {
      'email': user.Email,
      'password': user.Password,
      'first_name': user.First_Name,
      'last_name': user.Last_Name,
      'phone': user.Telephone,
      'role': user.Role,
      'bankemployee': {
        'bank': this.bankID,
        'unit': user.Unit,
      } 
    }
  }

  createObservableUsers(data) {
    return this.httpServise.createNewUserBank(data);
  }

  removeUser(index) {
    this.usersArr.splice(index, 1);
    this.observableArrUsers.splice(index, 1);
    if(this.usersArr.length == 0) {
      this.selectedFile = undefined;
    }
  }

  createNewUser() {
    this.loadingCreate = true;
    this.subscriptionUsers = forkJoin(this.observableArrUsers).subscribe({
      next: (response: any) => {},
      error: error => {
        this.loadingCreate = false;
        this.errorService.handleError(error);
        this.errorService.handleErrorToast(error);
        console.error('There was an error!', error);
      },
      complete: () => {
        this.loadingCreate = false;
        this.usersArr = new Array();
        this.observableArrUsers = new Array();
        this.selectedFile = undefined;
        this.toastService.showSuccessToast();
      }
    });
  }

  // ------------------------------------------------------------------------------

  ngOnDestroy(): void {
    localStorage.removeItem('bankID');
    localStorage.removeItem('bankBIN');
    this.subscription1.unsubscribe();
    this.subscriptionMerchants.unsubscribe();
    this.subscriptionAtms.unsubscribe();
    this.subscriptionUsers.unsubscribe();
  }
}
