import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { Authorization } from '../../share/models/authorization.model';
import { AuthService } from '../../share/services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public data: Authorization;

  constructor(private authService: AuthService, private router: Router) {
    this.data = new Authorization();
    this.reactiveForm = new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      recaptchaReactive: new FormControl(null, Validators.required)
    });
  }

  @HostListener('document:keydown.enter', ['$event'])
  onClickEnter(event) {
    if(!this.reactiveForm.invalid) {
      this.enter();
    }
  }


  @ViewChild('email') buttonSubmit: any;
  
  loginSubscription: Subscription = new Subscription();
  getTokenSubscription: Subscription = new Subscription();

  isLoginDataError: boolean = false;
  reactiveForm: FormGroup;
  ngOnInit(): void {
    
  }

  handleKeyUp(e){
    if(e.keyCode === 13)
      this.enter();
  }

  resolved(captchaResponse: string) {   
    setTimeout(() => {this.buttonSubmit.nativeElement.focus()}, 1000)
  }

  enter() {
    this.data.email = this.reactiveForm.value.email;
    this.data.password = this.reactiveForm.value.password;
    this.getTokenSubscription = this.authService.getToken(this.data).subscribe({
      next: (response: any) => {
        this.isLoginDataError = false;
        localStorage.setItem('token', response.access);
        localStorage.setItem('tokenExpiredDate', (new Date().getTime() + 3600000).toString());
      },
      error: error => {
        this.isLoginDataError = true;
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

        if (response['password_change_required']) {
          this.router.navigate(['/password']);
        }

        role = response.role;

        if(response['password_change_required'])
          password_change_required = true;

        if(response.role.length == 0) {
          localStorage.setItem('role', 'user');
        } else {
          localStorage.setItem('role', response.role);
          localStorage.setItem('fio', response.first_name +' '+ response.last_name);
          localStorage.setItem('user_id', response['id']);
        }
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
        if(password_change_required) {
          this.router.navigate(['auth', 'password']);
        } else {
          if(role == 'chargeback_officer')
            this.router.navigate(['cop', 'cabinet', 'claims']);
          else if(role == 'security_officer')
            this.router.navigate(['cop', 'cabinet', 'secur-officer']);
          else if(role == 'cop_manager')
            this.router.navigate(['cop', 'cabinet', 'bank-list']);
          else if(role == 'merchant')
            this.router.navigate(['cop', 'cabinet', 'claims','all']);
          else if(role == 'cardholder')
            this.router.navigate(['cop', 'cabinet', 'claims','all']);
          else if(role == 'top_level')
            this.router.navigate(['cop', 'cabinet', 'top-officer']);
          else
            this.router.navigate(['cop', 'cabinet']);
        }

      }
    });
  }

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
    this.getTokenSubscription.unsubscribe();
  }
}
