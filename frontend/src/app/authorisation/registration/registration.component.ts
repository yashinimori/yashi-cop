import { Component, OnInit } from '@angular/core';
import { Registration } from '../../share/models/registration.model';

@Component({
  selector: 'ngx-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  public data: Registration;

  constructor() {
    this.data = new Registration();
  }

  ngOnInit(): void {
  
  }

  enter() {
    if (!this.data.email)
      return;

    if (!this.data.firstName)
      return;

    if (!this.data.lastName)
      return;

    if (!this.data.login)
      return;

    if (!this.data.telephone)
      return;
  }

  
}
