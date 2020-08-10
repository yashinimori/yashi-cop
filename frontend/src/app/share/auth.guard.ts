import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {

  }
  private token:any;
  canActivate(
    next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      this.token = localStorage.getItem('token');
      if (this.token != undefined) {
          return true;
      }
      this.router.navigate(['auth', 'login'], { queryParams: { returnUrl: state.url }});
      return false;
    }
  
  
}
