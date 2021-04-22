import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { HttpService } from '../../../share/services/http.service';
import { Router } from '@angular/router';
import { TransferService } from '../../../share/services/transfer.service';
import { ATM } from '../../../share/models/atm.model'
import { Subscription } from 'rxjs';
import { ErrorService } from '../../../share/services/error.service';
import { ToastService } from '../../../share/services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-atm',
  templateUrl: './atm.component.html',
  styleUrls: ['./atm.component.scss']
})

export class ATMComponent implements OnInit, OnDestroy {
  public data: ATM;
  bankID: any;
  bankBin: string;
  role: any;
  loadingCreate = false;

  constructor(private httpService: HttpService,
    private router: Router,
    private transferService: TransferService, private translate: TranslateService,
    private errorService: ErrorService, private toastService: ToastService) {
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

  ngOnInit(): void {
    this.data = new ATM();

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
    this.role = localStorage.getItem('role');
  }

  goBack(){
    this.transferService.bankID.next(this.bankID);
    if(this.role == 'cop_manager'){
      this.router.navigate(['cop', 'cabinet', 'bank-single']);
    } else {
      this.router.navigate(['cop', 'cabinet']);
    }
  }

  createATM() {
    if(this.enter() == 0){
      this.loadingCreate = true;
      let d = {
        "merch_id": this.data.merch_id,
        "name_ips": this.data.name_ips,
        "bank": Number(this.bankID),
        "name_legal": this.data.name_legal,
        "bin": this.bankBin,
        "mcc": this.data.mcc,
        "description": this.data.description,
        "address": this.data.address,
        "contact_person": this.data.contact_person   
      };

      this.subscription1 = this.httpService.createNewATM(d).subscribe({
        next: (response: any) => {
        },
        error: error => {
          this.loadingCreate = false;
          this.errorService.handleError(error);
          this.errorService.handleErrorToast(error);
          console.error('There was an error!', error);
        },
        complete: () => {
          this.toastService.showToast('success', 'top-end', this.translate.instant('claims_component.text_auth_code'));
          this.loadingCreate = false;
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

  ngOnDestroy() {
    localStorage.removeItem('bankID');
    localStorage.removeItem('bankBIN');
    this.subscription1.unsubscribe();
  }
}
