import { Component } from '@angular/core';
import { Registration } from '../../../models/registration.model';

@Component({
  selector: 'ngx-registration',
  styleUrls: ['./registration.component.scss'],
  templateUrl: './registration.component.html',
})
export class RegistrationComponent {
  public data: Registration;

  constructor(){
    this.data = new Registration();
  }


  enter(){
    if(!this.data.email)
      return;

    if(!this.data.firstName)
      return;

    if(!this.data.lastName)
      return;

    if(!this.data.login)
      return;

    if(!this.data.telephone)
      return;
  
    alert('save') ;
  }
}
