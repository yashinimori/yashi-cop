import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../share/services/http.service';
import { Router } from '@angular/router';
import { SelectorData } from '../../../share/models/selector-data.model';
import { MerchUser } from '../../../share/models/merch-user.model';

@Component({
  selector: 'ngx-merch-user',
  templateUrl: './merch-user.component.html',
  styleUrls: ['./merch-user.component.scss']
})

export class MerchUserComponent implements OnInit {
  public data: MerchUser;

  constructor(private httpService: HttpService,
              private router: Router,) {
  
  }

  ngOnInit(): void {
    this.data = new MerchUser();

    // this.httpService.getMerchantsAll().subscribe({
    //   next: (response: any) => {
    //     console.log('getMerchants() ok');
    //     console.log(response); 
    //   },
    //   error: error => {
    //     console.error('There was an error!', error);
    //   },
    //   complete: () => {
       
    //   }
    // });

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
            "bank": [],
            "name_legal": this.data.name_legal,
            "bin": '', // this.data.bin,
            "mcc": this.data.mcc,
            "description": this.data.description,
            "address": this.data.address,
            "contact_person": this.data.contact_person
          }
      };

      console.log(d);

      this.httpService.createNewUser(d).subscribe({
        next: (response: any) => {
          console.log('ok');
          console.log(response); 
          //this.router.navigate(['ourpages']);
        },
        error: error => {
          console.error('There was an error!', error);
        },
        complete: () => {
         
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
