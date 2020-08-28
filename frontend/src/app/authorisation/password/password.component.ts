import { Component, OnInit, OnDestroy } from '@angular/core';
import { Authorization } from '../../share/models/authorization.model';
import { AuthService } from '../../share/services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit, OnDestroy {
  public data: Authorization;
  
  constructor(private authService: AuthService, 
    private router: Router) {
    this.data = new Authorization();
  }
  
  getTokenSubscription: Subscription = new Subscription();

  ngOnInit(): void {
  }

  OnInit(){
    this.data = new Authorization();
  }

  enter() {
    // this.getTokenSubscription = this.authService.getToken(this.data).subscribe({
    //   next: (response: any) => {
    //     console.log(response); 
    //     localStorage.setItem('token', response.access); 
    //     localStorage.setItem('tokenExpiredDate', (new Date().getTime() + 3600000).toString());    
    //   },
    //   error: error => {
    //     console.error('There was an error!', error);
    //   },
    //   complete: () => {
        
    //   }
    // });

    if(this.data.confirm_password === this.data.password ){

      this.getTokenSubscription = this.authService.setPassword(this.data).subscribe({
        next: (response: any) => {
          console.log(response); 

        },
        error: error => {
          console.error('There was an error!', error);
        },
        complete: () => {
          this.router.navigate(['auth', 'login']);
        }
      });

    }

  }

    ngOnDestroy(): void {
    this.getTokenSubscription.unsubscribe();
  }
}
