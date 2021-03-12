import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private router: Router, private toastService: ToastService) { }

  handleError(error:any) {
    if(error.statusText == 'Unauthorized') {
      this.logOut();
    }
  }

  handleErrorToast(error:any) {
    this.toastService.showToast('danger', 'top-end', 'Сталася помилка');
  }

  private logOut() {
    localStorage.clear();
    this.router.navigate(['auth', 'login']);
  }
}
