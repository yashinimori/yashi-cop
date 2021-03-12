import { Injectable } from '@angular/core';
import { NbComponentStatus, NbGlobalLogicalPosition, NbToastrService } from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastrService: NbToastrService,) { }

  showToast(status: NbComponentStatus, position, text: string) {
    this.toastrService.show(status, text, { status, position});
  }

  showSuccessToast() {
    const status: NbComponentStatus = 'success';
    const position = NbGlobalLogicalPosition.TOP_END;
    const text = 'Успіх!';
    this.toastrService.show(status, text, { status, position});
  }
}
