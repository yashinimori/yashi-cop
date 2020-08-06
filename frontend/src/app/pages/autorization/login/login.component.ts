import { Component } from '@angular/core';
import { Authorization } from '../../../models/authorization.model';

@Component({
  selector: 'ngx-login',
  styleUrls: ['./login.component.scss'],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  public data: Authorization;
  
  constructor(){
    this.data = new Authorization();
    console.log('AuthorizationComponent - constructor');
  }


  enter(){
    if(!this.data.login)
      return;

    if(!this.data.password)
      return;

    console.log(this.data);
    
  }
}
