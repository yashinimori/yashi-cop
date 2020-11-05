import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private router: Router) { }

  handleError(error:any) {
    if(error.statusText == 'Unauthorized') {
      this.logOut();
    }
  }

  private logOut() {
    localStorage.clear();
    this.router.navigate(['auth', 'login']);
  }
}
