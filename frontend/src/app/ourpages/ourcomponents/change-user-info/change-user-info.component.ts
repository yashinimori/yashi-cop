import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbComponentStatus, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { ErrorService } from '../../../share/services/error.service';
import { HttpService } from '../../../share/services/http.service';

@Component({
  selector: 'ngx-change-user-info',
  templateUrl: './change-user-info.component.html',
  styleUrls: ['./change-user-info.component.scss']
})
export class ChangeUserInfoComponent implements OnInit, OnDestroy {

  constructor(private httpService: HttpService, private toastrService: NbToastrService, private errorService: ErrorService) {
    this.reactiveForm = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      phone: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.maxLength(10),
        Validators.minLength(10)
      ])),
      email: new FormControl(null, Validators.required)
    });
   }

  oldPassword = '';
  newPassword = '';
  newPasswordRepeat = '';
  showPassword = true;
  isPasswordDifferent = false;
  getUserInfoSubscription: Subscription = new Subscription();
  saveUserInfoSubscription: Subscription = new Subscription();
  updateUserPasswordSubscription: Subscription = new Subscription();
  reactiveForm: FormGroup;
  loading = false;
  isUdateError: boolean = false;
  isPasswordError: boolean = false;
  loadingPassword: boolean = false;
  private userInfo:any;

  ngOnInit(): void {
    this.loadUserInfo();
    
  }

  loadUserInfo() {
    this.getUserInfoSubscription = this.httpService.getUserInfo().subscribe({
      next: (response: any) => {
        this.reactiveForm = new FormGroup({
          firstName: new FormControl(response.first_name, Validators.required),
          lastName: new FormControl(response.last_name, Validators.required),
          phone: new FormControl(response.phone, Validators.compose([
            Validators.required,
            Validators.pattern('^[0-9]*$'),
            Validators.maxLength(10),
            Validators.minLength(10)
          ])),
          email: new FormControl(response.email, Validators.required)
        });
        this.userInfo = JSON.parse(JSON.stringify(response));
      },
      error: error => {
        this.errorService.handleError(error);
        console.error('There was an error!', error);
      }, 
      complete: () => {
      }
    });
  }

  saveUserInfo() {
    let obj = {
      first_name: this.reactiveForm.value.firstName,
      last_name: this.reactiveForm.value.lastName,
      phone: this.reactiveForm.value.phone,
      // is_active: this.userInfo.is_active,
      // created_by: this.userInfo.created_by,
      role: this.userInfo.role,
      // password_change_required: this.userInfo.password_change_required,
    }
    this.loading = true;
    this.isUdateError = false;
    this.saveUserInfoSubscription = this.httpService.updateUserInfo(obj).subscribe({
      next: (response: any) => {
      },
      error: error => {
        this.errorService.handleError(error);
        this.errorService.handleErrorToast(error);
        console.error('There was an error!', error);
        this.isUdateError = true;
        this.loading = false;
      }, 
      complete: () => {
        this.showToast('success', 'bottom-end', 'Success');
        this.loading = false;
      }
    });
  }

  showToast(status: NbComponentStatus, position, text: string) {
    this.toastrService.show(status, text, { status, position});
  }

  updatePassword() {
    if(this.newPasswordRepeat === this.newPassword) {
      this.isPasswordDifferent = false;
      this.writeNewPassword();
    } else {
      this.isPasswordError = false;
      this.isPasswordDifferent = true;      
    }
  }

  writeNewPassword() {
    this.loadingPassword = true;
    this.isPasswordError = false;
    this.updateUserPasswordSubscription = this.httpService.updateUserPassword(this.newPassword, this.oldPassword).subscribe({
      next: (response: any) => {
      },
      error: error => {
        this.errorService.handleError(error);
        this.errorService.handleErrorToast(error);
        console.error('There was an error!', error);
        this.isPasswordError = true;
        this.loadingPassword = false;
      }, 
      complete: () => {
        this.showToast('success', 'bottom-end', 'Success');
        this.loadingPassword = false;
        this.oldPassword = '';
        this.newPassword = '';
        this.newPasswordRepeat = '';
      }
    });
  }

  ngOnDestroy() {
    this.getUserInfoSubscription.unsubscribe();
    this.saveUserInfoSubscription.unsubscribe();
    this.updateUserPasswordSubscription.unsubscribe();
  }
}
