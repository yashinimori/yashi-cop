import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { HttpService } from '../../../share/services/http.service';
import { Router } from '@angular/router';
import { MerchUser } from '../../../share/models/merch-user.model';
import { TransferService } from '../../../share/services/transfer.service';
import { Subscription } from 'rxjs';
import { ErrorService } from '../../../share/services/error.service';
import { ToastService } from '../../../share/services/toast.service';

@Component({
  selector: 'ngx-merch-user',
  templateUrl: './merch-user.component.html',
  styleUrls: ['./merch-user.component.scss']
})

export class MerchUserComponent implements OnInit, OnDestroy {
  public data: MerchUser;
  bankID: any;
  bankBin: string;
  role: any;
  loadingCreate = false;

  constructor(private httpService: HttpService,
    private router: Router, private toastService: ToastService,
    private transferService: TransferService, private errorService: ErrorService) {
      this.bankID = '';
      this.role = '';
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler($event) {
    if (this.bankID && this.bankID != '0') {
      localStorage.setItem('bankID', this.bankID);
    }
    if (this.bankBin && this.bankBin != '0') {
      localStorage.setItem('bankBIN', this.bankBin);
    }
  }

  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  banksList: any;

  ngOnInit(): void {
    this.data = new MerchUser();
    if(localStorage.getItem('bankID')) {
      this.bankID = Number(localStorage.getItem('bankID'));
    } else {
      this.bankID = this.transferService.bankID.getValue();
    }
    if(localStorage.getItem('bankBIN')) {
      this.bankBin = localStorage.getItem('bankBIN');
    } else {
      this.bankBin = this.transferService.bankBIN.getValue();
    }
    // this.bankID = this.transferService.bankID.getValue();
    // this.bankBin = this.transferService.bankBIN.getValue();
    this.role = localStorage.getItem('role');
    this.getListBanks()
  }

  goBack(){
    this.transferService.bankID.next(this.bankID);
    if(this.role == 'top_level'){
      this.router.navigate(['cop', 'cabinet', 'top-officer', 'merchants']);
    } else{
      this.router.navigate(['cop', 'cabinet', 'bank-single']);
    }
  }

  createMerchUser() {
    this.data.role = 'merchant';
    if(this.enter() == 0){
      this.loadingCreate = true;
      let d = {
        "email": this.data.email,
        "password": this.data.password,
        "first_name": 'no name',
        "last_name": 'no name',
        "phone": this.data.phone,
        "role": "merchant",
        "merchant" : {
            "merch_id": this.data.merch_id,
            "name_ips": this.data.name_ips,
            "bank": [Number(this.bankID)],
            "name_legal": this.data.name_legal,
            "bin": this.bankBin,
            "mcc": this.data.mcc,
            "description": this.data.description,
            "address": this.data.address,
            "contact_person": this.data.contact_person
          }
      };

      this.subscription1 = this.httpService.createNewUserMerch(d).subscribe({
        next: (response: any) => {
        },
        error: error => {
          this.loadingCreate = false;
          this.errorService.handleError(error);
          this.errorService.handleErrorToast(error);
          console.error('There was an error!', error);
        },
        complete: () => {
          this.loadingCreate = false;
          this.toastService.showSuccessToast();
          this.goBack();
        }
      });
    }
  }

  enter() {
    // if (!this.data.name_legal)
    //   return 1;
    // if (!this.data.mcc)
    //   return 1;
    // if (!this.data.description)
    //   return 1;
    // if (!this.data.name_ips)
    //   return 1;
    // if (!this.data.address)
    //   return 1;
    // if (!this.data.contact_person)
    //   return 1;

    // if (!this.data.email)
    //   return 1;

    // if (!this.data.phone)
    //   return 1;

    // if (!this.data.role)
    //   return 1;
    return 0;
  }

  private getListBanks() {
    this.banksList = new Array<any>();

    this.subscription2 = this.httpService.getAllBank().subscribe({
      next: (response: any) => {
        this.banksList = response;
      },
      error: error => {
        this.errorService.handleError(error);
        console.error('There was an error!', error);
      },
      complete: () => {}
    });
  }

  ngOnDestroy() {
    localStorage.removeItem('bankID');
    localStorage.removeItem('bankBIN');
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
