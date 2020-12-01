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
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    //this.checkPath(role, state.url)
    if (this.token) {
      if (Number(localStorage.getItem('tokenExpiredDate')) < new Date().getTime()) {
        localStorage.clear();
        this.router.navigate(['auth', 'login']);
        return false;
      } else {
        if(this.checkPath(role, state.url)) {
          return true;
        }
        return false;
        //return true;
      }
    }
    
    this.router.navigate(['auth', 'login'], { queryParams: { returnUrl: state.url }});
    return false;
  }

  private checkPath(role: string, url: string): boolean {
    switch (role) {
      case 'user': //all ++
        if(url == '/cop/cabinet/claims/all' ||
         url == '/cop/cabinet/claims/archive' || 
         url == '/cop/cabinet/single-claim' ||
         url == '/cop/cabinet/single-claim-forms' ||
         url == '/cop/cabinet/change-user-info') {
          return true;
        } else {
          return false;
        }
      case 'сс_branch': //all ++
        if(url == '/cop/cabinet/claims/all' ||
         url == '/cop/cabinet/claims/archive' || 
         url == '/cop/cabinet/single-claim' ||
         url == '/cop/cabinet/single-claim-forms' ||
         url == '/cop/cabinet/change-user-info') {
          return true;
        } else {
          return false;
        }
      case 'cardholder': //all in user ++
        if(url == '/cop/cabinet/claims/all' ||
         url == '/cop/cabinet/claims/archive' || 
         url == '/cop/cabinet/single-claim' ||
         url == '/cop/cabinet/single-claim-forms' ||
         url == '/cop/cabinet/change-user-info') {
          return true;
        } else {
          return false;
        }
      case 'admin':
        return true;
      case 'cop_manager': //all
        if(url == '/cop/cabinet/bank-list' ||
        url == '/cop/cabinet/bank' || 
        url == '/cop/cabinet/statistic' ||
        url == '/cop/cabinet/bank-single' ||
        url == '/cop/cabinet/bank-statistic' || 
        url == '/cop/cabinet/bank-user'||
        url == '/cop/cabinet/merch-user' || 
        url == '/cop/cabinet/atm' ||
        url == '/cop/cabinet/change-user-info' ||
        url == '/cop/cabinet/register/merchant') {
          return true;
        } else {
          return false;
        }
      case 'chargeback_officer': //all ?
        if(url == '/cop/cabinet/claims' ||
         url == '/cop/cabinet/chbo-dashboard' || 
         url == '/cop/cabinet/atm-log-upload' ||
         url == '/cop/cabinet/atm-log-view' ||
         url == '/cop/cabinet/atm-log-view-detail' || 
         url == '/cop/cabinet/chbo-my-claims/pre_mediation'||
         url == '/cop/cabinet/chbo-my-claims/mediation' || 
         url == '/cop/cabinet/chbo-my-claims/chargeback' ||
         url == '/cop/cabinet/chbo-my-claims/closed' ||
         url == '/cop/cabinet/single-claim' ||
         url == '/cop/cabinet/single-claim-forms' ||
         url == '/cop/cabinet/tutorials' ||
         url == '/cop/cabinet/change-user-info') {
          return true;
        } else {
          return false;
        }
      case 'merchant': //+
        if(url == '/cop/cabinet/claims/all' ||
         url == '/cop/cabinet/claims/archive' || 
         url == '/cop/cabinet/single-claim' ||
         url == '/cop/cabinet/single-claim-forms' ||
         url == '/cop/cabinet/change-user-info') {
          return true;
        } else {
          return false;
        }
      case 'top_level': //all +
        if(url == '/cop/cabinet/top-officer/users' || url == '/cop/cabinet/top-officer/merchants' ||
         url == '/cop/cabinet/bank-statistic' || 
         url == '/cop/cabinet/bank-user' ||
         url == '/cop/cabinet/merch-user' ||
         url == '/cop/cabinet/change-user-info') {
          return true;
        } else {
          return false;
        }
      case 'security_officer': //all +
        if(url == '/cop/cabinet/secur-officer' ||
         url == '/cop/cabinet/claims/bank-user' || 
         url == '/cop/cabinet/secur-officer-user' ||
         url == '/cop/cabinet/change-user-info') {
          return true;
        } else {
          return false;
        }
      default:
        return false;
    }
  }
  
  
}
