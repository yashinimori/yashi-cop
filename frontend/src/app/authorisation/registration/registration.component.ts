import {Component, OnInit} from '@angular/core';
import {Registration} from '../../share/models/registration.model';
import {HttpService} from '../../share/services/http.service';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../ourpages/ourcomponents/showcase-dialog/showcase-dialog.component';

@Component({
  selector: 'ngx-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  providers: [FormBuilder],
})

export class RegistrationComponent implements OnInit {
  public data: Registration;
  // protected aFormGroup: FormGroup;
  siteKey: string;

  // RegistrationData: RegistrationView;
  constructor(private httpService: HttpService,
              private router: Router,
              //private formBuilder: FormBuilder
              private dialogService: NbDialogService ) {
    this.data = new Registration();
    this.siteKey = '6LfplMYZAAAAAGz2M_VNGdAAW_6H7YFhab7-871I';
  }

  ngOnInit(): void {
    //console.log(this.data.role)
    // this.aFormGroup = this.formBuilder.group({
    //   recaptcha: ['', Validators.required]
    // });
  }

  resolved(captchaResponse: string, res) {
    //console.log(`Resolved response token: ${captchaResponse}`);

  }

  createUser() {
    //console.log('createUser()');

    if(!this.enter())
      return;

    //console.log(this.data);
    // this.data.email.length
    this.httpService.createNewUser(this.data).subscribe({
      next: (response: any) => {
        //console.log('ok');
        //console.log(response);
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
        console.error('There was an error!', error);
      },
      complete: () => {

      }
    });
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


}
