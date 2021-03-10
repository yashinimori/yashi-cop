import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Registration} from '../../share/models/registration.model';
import {HttpService} from '../../share/services/http.service';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../ourpages/ourcomponents/showcase-dialog/showcase-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  providers: [FormBuilder],
})

export class RegistrationComponent implements OnInit, OnDestroy {
  public data: Registration;
  // protected aFormGroup: FormGroup;
  siteKey: string;
  reactiveForm: FormGroup;
  isPasswordDifferent: boolean = false;
  isError: boolean = false;
  subscription1: Subscription = new Subscription();

  @HostListener('document:keydown.enter', ['$event'])
  onClickEnter(event) {
    if(!this.reactiveForm.invalid) {
      this.createUser();
    }
  }


  @ViewChild('password2') buttonSubmit: any;
  
  // RegistrationData: RegistrationView;
  constructor(private httpService: HttpService,
              private router: Router,
              //private formBuilder: FormBuilder
              private dialogService: NbDialogService ) {
    this.data = new Registration();
    this.siteKey = '6LfplMYZAAAAAGz2M_VNGdAAW_6H7YFhab7-871I';

    this.reactiveForm = new FormGroup({
      first_name: new FormControl(null, Validators.required),
      last_name: new FormControl(null, Validators.required),
      phone: new FormControl(null, Validators.required),
      login: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.minLength(10)
      ])),

      password2: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.minLength(10)
      ])),

      recaptchaReactive: new FormControl(null, Validators.required)
    });
  }
 

  ngOnInit(): void {
    // this.aFormGroup = this.formBuilder.group({
    //   recaptcha: ['', Validators.required]
    // });
  }

  resolved(captchaResponse: string) {   
    setTimeout(() => {this.buttonSubmit.nativeElement.focus()}, 1000)
  }

  createUser() {
    this.data.first_name = this.reactiveForm.value.first_name;
    this.data.last_name = this.reactiveForm.value.last_name;
    this.data.phone = this.reactiveForm.value.phone;
    this.data.email = this.reactiveForm.value.email;
    this.data.login = this.reactiveForm.value.login;
    this.data.password = this.reactiveForm.value.password;
    this.data.role = "cardholder";
    if(!this.enter())
      return;
    if(this.reactiveForm.value.password === this.reactiveForm.value.password2) {
      this.isPasswordDifferent = false;
      this.subscription1 = this.httpService.createNewUser(this.data).subscribe({
        next: (response: any) => {
          this.isError = false;
          this.dialogService.open(ShowcaseDialogComponent, {
            context: {
              title: 'Реєстрація',
              content: 'Ви були успішно зареєстровані в системі. Для активації перейдіть, будь ласка, за посиланням з отриманого на ваш e-mail листа'
            },
          });
          setTimeout(()=>{
            this.router.navigate(['auth', 'login']);
          }, 2000);
        },
        error: error => {
          this.isError = true;
          console.error('There was an error!', error);
        },
        complete: () => {

        }
      });
    } else {
      this.isPasswordDifferent = true;
    }

  }

  enter() {
    if (!this.data.first_name)
      return false;

    if (!this.data.last_name)
      return false;

    if (!this.data.email)
      return false;
      
    if (!this.data.phone)
      return false;

    if (!this.data.login)
      return false;

    if (!this.data.password)
      return false;

    return true;  
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
  }

}
