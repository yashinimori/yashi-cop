import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Registration } from '../../../../models/registration.model';


@Component({
  selector: 'ngx-dialog-registration',
  templateUrl: 'dialog-registration.component.html',
  styleUrls: ['dialog-registration.component.scss'],
})
export class DialogRegistrationComponent {
  public data: Registration;

  constructor(protected ref: NbDialogRef<DialogRegistrationComponent>) {
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
  
    this.ref.close(this.data);  
  }
}
