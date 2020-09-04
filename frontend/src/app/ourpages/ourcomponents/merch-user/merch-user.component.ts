import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../share/services/http.service';
import { Router } from '@angular/router';
import { SelectorData } from '../../../share/models/selector-data.model';
import { MerchUser } from '../../../share/models/merch-user.model';
import { TransferService } from '../../../share/services/transfer.service';

@Component({
  selector: 'ngx-merch-user',
  templateUrl: './merch-user.component.html',
  styleUrls: ['./merch-user.component.scss']
})

export class MerchUserComponent implements OnInit {
  public data: MerchUser;
  bankID: string;
  bankBin: string;
  role: any;

  constructor(private httpService: HttpService,
    private router: Router,
    private transferService: TransferService,) {

      this.bankID = '';
      this.role = '';
  }

  banksList: any;

  ngOnInit(): void {
    this.data = new MerchUser();

    this.bankID = this.transferService.bankID.getValue();
    this.bankBin = this.transferService.bankBIN.getValue();
    this.role = localStorage.getItem('role');

    this.getListBanks()

  }

  goBack(){
    this.transferService.bankID.next(this.bankID);
    if(this.role == 'top_level'){
      this.router.navigate(['ourpages', 'ourcomponents', 'top-officer']);
    } else{
      this.router.navigate(['ourpages', 'ourcomponents', 'bank-single']);
    }

  }

  createMerchUser() {
    this.data.role = 'merchant';


    if(this.enter() == 0){

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


      this.httpService.createNewUserMerch(d).subscribe({
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


  private getListBanks() {
    this.banksList = new Array<any>();

    this.httpService.getAllBank().subscribe({
      next: (response: any) => {
        this.banksList = response;
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {}
    });
  }
}
