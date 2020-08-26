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
  }


  createMerchUser() {
    this.data.role = 'merchant';

    if(this.enter() == 0){

      console.log(this.data);
    
      this.httpService.createNewMerchUser(this.data).subscribe({
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

    if (!this.data.merchantId)
      return 1;
    if (!this.data.merchantName)
      return 1;
    if (!this.data.mcc)
      return 1;
    if (!this.data.description)
      return 1;
    if (!this.data.merchantNameIPS)
      return 1;
    if (!this.data.address)
      return 1;
    if (!this.data.terminalId)
      return 1;
    if (!this.data.contactPerson)
      return 1;

    if (!this.data.email)
      return 1;

    if (!this.data.phone)
      return 1;
    
    if (!this.data.role)
      return 1;

    return 0;
  }

  
  
}
