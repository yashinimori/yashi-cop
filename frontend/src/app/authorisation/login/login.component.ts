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
    this.loginSubscription = this.authService.login().subscribe({
      next: (response: any) => {
        console.log(response); 
        localStorage.setItem('role', response.role);          
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
        this.router.navigate(['ourpages', 'ourcomponents', 'claims']);
      }
    });
  }

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
    this.getTokenSubscription.unsubscribe();
  }
}
