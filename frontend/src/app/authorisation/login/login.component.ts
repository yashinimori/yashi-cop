import { Component, OnInit } from '@angular/core';
import { Authorization } from '../../share/models/authorization.model';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public data: Authorization;
  
  constructor() {
    this.data = new Authorization();
  }

  ngOnInit(): void {
  }

  enter() {
    if (!this.data.login)
      return;

    if (!this.data.password)
      return;
  }
}
