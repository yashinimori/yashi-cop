import { Component, OnInit, OnDestroy } from '@angular/core';
import { Authorization } from '../../share/models/authorization.model';
import { AuthService } from '../../share/services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public data: Authorization;
  
  constructor(private authService: AuthService, private router: Router) {
    this.data = new Authorization();
  }
  loginSubscription: Subscription = new Subscription();
  getTokenSubscription: Subscription = new Subscription();

  ngOnInit(): void {
  }

  handleKeyUp(e){
    //console.log(e);
    if(e.keyCode === 13){
      console.log(e);
       this.enter();
  
      }
  }

  enter() {
    //console.log("enter()");
    //console.log(this.data);
    // localStorage.setItem('token', 'erwer');
    // localStorage.setItem('role', 'user');
    // this.router.navigate(['ourpages', 'ourcomponents', 'claims']);
    this.getTokenSubscription = this.authService.getToken(this.data).subscribe({
      next: (response: any) => {
        //console.log(response); 
        localStorage.setItem('token', response.access); 
        localStorage.setItem('tokenExpiredDate', (new Date().getTime() + 3600000).toString());    
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
        this.getUserInfo();
      }
    });
  }

  
  getUserInfo() {
    let password_change_required = false;
    let role = '';
    this.loginSubscription = this.authService.login().subscribe({
      next: (response: any) => {
        //console.log('getUserInfo'); 
        //console.log(response); 
        role = response.role;
        console.log(role); 

        if(response['password_change_required']) 
          password_change_required = true;

        if(response.role.length == 0) {
          localStorage.setItem('role', 'user');
        } else {
          localStorage.setItem('role', response.role);
          localStorage.setItem('fio', response.first_name +' '+ response.last_name);
          localStorage.setItem('user_id', response['id']);
        }
        //console.log(localStorage);
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
        if(password_change_required) {
          this.router.navigate(['auth', 'password']);
        } else {
          if(role == 'chargeback_officer')
            this.router.navigate(['ourpages', 'ourcomponents', 'claims']);
          else if(role == 'security_officer')
            this.router.navigate(['ourpages', 'ourcomponents', 'secur-officer']);
          else if(role == 'cop_manager')
            this.router.navigate(['ourpages', 'ourcomponents', 'bank-list']);
          else if(role == 'merchant')
            this.router.navigate(['ourpages', 'ourcomponents', 'claims','all']);
          else if(role == 'cardholder')
            this.router.navigate(['ourpages', 'ourcomponents', 'claims','all']);
          else if(role == 'top_level')
            this.router.navigate(['ourpages', 'ourcomponents', 'top-officer']);
          else
            this.router.navigate(['ourpages', 'ourcomponents']);
        }
          
      }
    });
  }

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
    this.getTokenSubscription.unsubscribe();
  }
}
