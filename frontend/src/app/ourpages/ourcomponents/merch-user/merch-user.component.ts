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
  role: any;

  constructor(private httpService: HttpService,
    private router: Router,
    private transferService: TransferService,) {
    
      this.bankID = '';
      this.role = '';
  }

  ngOnInit(): void {
    this.data = new MerchUser();

    this.bankID = this.transferService.bankID.getValue();
    console.log('this.bankID = ' + this.bankID);
    
    this.role = localStorage.getItem('role');
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
      console.log('createMerchUser()');
      console.log(this.data);
    
      let d = {
        "email": this.data.email,
        "password": this.data.password,
        "first_name": this.data.first_name,
        "last_name": this.data.last_name,
        "phone": this.data.phone,
        "role": "merchant",
        "merchant" : {
            "merch_id": this.data.merch_id,
            "name_ips": this.data.name_ips,
            "bank": [Number(this.bankID)],
            "name_legal": this.data.name_legal,
            "bin": '', // this.data.bin,
            "mcc": this.data.mcc,
            "description": this.data.description,
            "address": this.data.address,
            "contact_person": this.data.contact_person
          }
      };

      console.log(d);

      this.httpService.createNewUserMerch(d).subscribe({
        next: (response: any) => {
          console.log('ok');
          console.log(response); 
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

  
  
}