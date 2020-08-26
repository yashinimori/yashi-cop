import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../share/services/http.service';
import { Router } from '@angular/router';
import { BankUser } from '../../../share/models/bank-user.model';
import { SelectorData } from '../../../share/models/selector-data.model';

@Component({
  selector: 'ngx-bank-user',
  templateUrl: './bank-user.component.html',
  styleUrls: ['./bank-user.component.scss']
})

export class BankUserComponent implements OnInit {
  public data: BankUser;
  public listRole: Array<SelectorData>;

  // RegistrationData: RegistrationView;
  constructor(private httpService: HttpService,
              private router: Router,) {
    this.data = new BankUser();
  
  }

  ngOnInit(): void {
    console.log(this.data.role);
    this.getRoles();
  }


  createBankUser() {
    this.data.registration_date = new Date();

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

  

  enter() {
    
    if (!this.data.userId)
      return;

    if (!this.data.email)
      return;

    if (!this.data.first_name)
      return;

    if (!this.data.last_name)
      return;

    if (!this.data.phone)
      return;
    
    if (!this.data.role)
      return;      
  }

  
  getRoles(){
    this.listRole = new Array<SelectorData>();
    this.listRole.push({id:1, caption:"cardholder"});
    this.listRole.push({id:2, caption:"merchant"});
    this.listRole.push({id:3, caption:"user"});
    this.listRole.push({id:4, caption:"chargeback_officer"});

  }

}
