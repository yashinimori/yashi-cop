import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Authorization } from '../../../../models/authorization.model';

@Component({
  selector: 'ngx-dialog-authorization',
  templateUrl: 'dialog-authorization.component.html',
  styleUrls: ['dialog-authorization.component.scss'],
})
export class DialogAuthorizationComponent {
  data: Authorization;

  constructor(protected ref: NbDialogRef<DialogAuthorizationComponent>) {
    this.data = new Authorization();
  }

  enter(){
    if(!this.data.login)
      return;

    if(!this.data.password)
      return;

    this.ref.close(this.data);  
  }
  
}
