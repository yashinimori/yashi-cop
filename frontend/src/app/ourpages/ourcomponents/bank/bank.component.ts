import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../share/services/http.service';
import { Router } from '@angular/router';
import { Bank } from '../../../share/models/bank.model';

@Component({
  selector: 'ngx-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss']
})

export class BankComponent implements OnInit {
  public data: Bank;


  // RegistrationData: RegistrationView;
  constructor(private httpService: HttpService,
              private router: Router,) {
  
  }

  ngOnInit(): void {
    this.data = new Bank();
  }

  createBankUser() {

    if(this.enter() == 0){

      console.log(this.data);
    
      this.httpService.createNewBankUser(this.data).subscribe({
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

    if (!this.data.bin)
      return 1;

    if (!this.data.asq_iss_both)
      return 1;

    if (!this.data.bankNameUKR)
      return 1;

    if (!this.data.operatorName)
      return 1;
    
    if (!this.data.contactPerson)
      return 1;

    if (!this.data.contactTelephone)
      return 1;

    if (!this.data.contactEmail)
      return 1;


    return 0;
  }

  
  

}
