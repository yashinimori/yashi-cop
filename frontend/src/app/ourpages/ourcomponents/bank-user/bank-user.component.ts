import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../share/services/http.service';
import { Router } from '@angular/router';
import { BankUser } from '../../../share/models/bank-user.model';
import { SelectorData } from '../../../share/models/selector-data.model';
import { TransferService } from '../../../share/services/transfer.service';

@Component({
  selector: 'ngx-bank-user',
  templateUrl: './bank-user.component.html',
  styleUrls: ['./bank-user.component.scss'],
})

export class BankUserComponent implements OnInit {
  public data: BankUser;
  public listRole: Array<SelectorData>;
  bankID: string;
  role: any;
  banksList: any;

  // RegistrationData: RegistrationView;
  constructor(private httpService: HttpService,
              private router: Router,
              private transferService: TransferService) {

    this.bankID = '';
    this.role = '';
  }

  ngOnInit(): void {
    this.data = new BankUser();
    this.role = localStorage.getItem('role');
    this.getRoles();

    this.bankID = this.transferService.bankID.getValue();

    this.getListBanks();
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
      complete: () => {
      },
    });
  }

  createBankUser() {
    if (this.enter() == 0) {

      const d = {
        'email': this.data.email,
        'password': this.data.password,
        'first_name': this.data.first_name,
        'last_name': this.data.last_name,
        'phone': this.data.phone,
        'role': this.data.role,
        'bankemployee': {
          'bank': this.bankID,
          'unit': this.data.unit,
        },
      };

      this.httpService.createNewUserBank(d).subscribe({
        next: (response: any) => {
        },
        error: error => {
          console.error('There was an error!', error);
        },
        complete: () => {
          this.goBack();
        },
      });

    }

  }

  goBack(){
    this.transferService.bankID.next(this.bankID);
    if (this.role == 'top_level') {
      this.router.navigate(['ourpages', 'ourcomponents', 'top-officer']);
    } else if (this.role == 'security_officer') {
      this.router.navigate(['ourpages', 'ourcomponents', 'secur-officer']);
    } else {
      this.router.navigate(['ourpages', 'ourcomponents', 'bank-single']);
    }
  }


  enter() {

    if (!this.data.userId)
      return 1;

    if (!this.data.email)
      return 1;

    if (!this.data.first_name)
      return 1;

    if (!this.data.last_name)
      return 1;

    if (!this.data.phone)
      return 1;

    if (!this.data.role)
      return 1;

    return 0;
  }


  getRoles() {
    this.listRole = new Array<SelectorData>();
    if (this.role === 'cop_manager') {
      this.listRole.push({id: 3, caption: 'security_officer'});
      this.listRole.push({id: 4, caption: 'chargeback_officer'});
      this.listRole.push({id: 6, caption: 'сс_branch'});
      this.listRole.push({id: 5, caption: 'cop_manager'});
      this.listRole.push({id: 4, caption: 'top_level'});
    } else if (this.role === 'top_level') {
      this.listRole.push({id: 3, caption: 'security_officer'});
    } else if (this.role === 'security_officer') {
      this.listRole.push({id: 4, caption: 'top_level'});
      this.listRole.push({id: 4, caption: 'chargeback_officer'});
      this.listRole.push({id: 6, caption: 'сс_branch'});
    }
  }

}
