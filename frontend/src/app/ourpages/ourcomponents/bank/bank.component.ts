import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpService} from '../../../share/services/http.service';
import {Router} from '@angular/router';
import {Bank} from '../../../share/models/bank.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss']
})

export class BankComponent implements OnInit, OnDestroy {
  public data: Bank;

  constructor(private httpService: HttpService,
              private router: Router) {
  }
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();

  ngOnInit(): void {
    this.data = new Bank();
  }

  createBank() {
    if(this.enter() == 0){
      this.subscription1 = this.httpService.createNewBank(this.data).subscribe({
        next: (response: any) => {

          const bank_id = response['id'];
          const user_data = {
            'role': 'top_level',
            'first_name': this.data.contact_person,
            'last_name': this.data.contact_person,
            'email': this.data.contact_email,
            'phone': this.data.contact_telephone,
            'bankemployee': {
              'bank': bank_id,
            },
          };

          this.subscription2 = this.httpService.createNewUser(user_data).subscribe({
              next: (response: any) => {
              },
              error: error => {
                console.error('There was an error!', error);
              },
              complete: () => {
              }
          })

          this.router.navigate(['cop', 'cabinet','bank-list']);

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

    if (!this.data.type)
      return 1;

    if (!this.data.name_uk)
      return 1;

    if (!this.data.contact_telephone)
      return 1;

    if (!this.data.contact_email)
      return 1;

    return 0;
  }

  ngOnDestroy() {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
