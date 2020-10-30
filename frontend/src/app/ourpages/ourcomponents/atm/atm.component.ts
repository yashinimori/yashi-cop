import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpService } from '../../../share/services/http.service';
import { Router } from '@angular/router';
import { TransferService } from '../../../share/services/transfer.service';
import { ATM } from '../../../share/models/atm.model'
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-atm',
  templateUrl: './atm.component.html',
  styleUrls: ['./atm.component.scss']
})

export class ATMComponent implements OnInit, OnDestroy {
  public data: ATM;
  bankID: string;
  bankBin: string;
  role: any;

  constructor(private httpService: HttpService,
    private router: Router,
    private transferService: TransferService,) {
      this.bankID = '';
      this.role = '';
  }

  subscription1: Subscription = new Subscription();

  ngOnInit(): void {
    this.data = new ATM();

    this.bankID = this.transferService.bankID.getValue();
    this.bankBin = this.transferService.bankBIN.getValue();
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
          console.error('There was an error!', error);
        },
        complete: () => {
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
    this.subscription1.unsubscribe();
  }
}
