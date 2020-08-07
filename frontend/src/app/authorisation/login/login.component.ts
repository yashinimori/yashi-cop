import { Component, OnInit, OnDestroy } from '@angular/core';
import { Authorization } from '../../share/models/authorization.model';
import { AuthService } from '../../share/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public data: Authorization;
  
  constructor(private authService: AuthService) {
    this.data = new Authorization();
  }
  loginSubscription: Subscription = new Subscription();

  ngOnInit(): void {
  }

  enter() {
    this.loginSubscription = this.authService.login(this.data).subscribe({
      next: (response: any) => {
        console.log(response);            
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
      }
    });
  }

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
  }
}
