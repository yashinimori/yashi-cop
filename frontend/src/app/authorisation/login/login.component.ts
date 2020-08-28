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

  enter() {
    //console.log("enter()");
    //console.log(this.data);
    // localStorage.setItem('token', 'erwer');
    // localStorage.setItem('role', 'user');
    // this.router.navigate(['ourpages', 'ourcomponents', 'claims']);
    this.getTokenSubscription = this.authService.getToken(this.data).subscribe({
      next: (response: any) => {
        console.log(response); 
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

    this.loginSubscription = this.authService.login().subscribe({
      next: (response: any) => {
        console.log('getUserInfo'); 
        console.log(response); 

        if(response['password_change_required']) 
          password_change_required = true;

        if(response.role.length == 0) {
          localStorage.setItem('role', 'user');
        } else {
          localStorage.setItem('role', response.role);
          localStorage.setItem('fio', response.first_name +' '+ response.last_name);
          localStorage.setItem('user_id', response['id']);
        }
        console.log(localStorage);
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
        if(password_change_required) 
          this.router.navigate(['auth', 'password']);
        else
          this.router.navigate(['ourpages', 'ourcomponents', 'claims']);
      }
    });
  }

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
    this.getTokenSubscription.unsubscribe();
  }
}
