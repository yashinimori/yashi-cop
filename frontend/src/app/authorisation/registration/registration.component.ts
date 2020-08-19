import { Component, OnInit } from '@angular/core';
import { Registration } from '../../share/models/registration.model';
import { RegistrationView } from '../../share/models/registration-view.model';
import { HttpService } from '../../share/services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})

export class RegistrationComponent implements OnInit {
  public data: Registration;


  RegistrationData: RegistrationView;
  constructor(private httpService: HttpService,
              private router: Router,) {
    this.data = new Registration();
  
  }


  ngOnInit(): void {
  
  }


  createUser() {
    console.log(this.RegistrationData);
    this.httpService.createNewUser(this.RegistrationData).subscribe({
      next: (response: any) => {
        console.log('ok');
        console.log(response); 
        this.router.navigate(['ourpages']);
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
       
      }
    });
  }

  

  enter() {
    if (!this.data.email)
      return;

    if (!this.data.first_name)
      return;

    if (!this.data.last_name)
      return;

    if (!this.data.login)
      return;

    if (!this.data.telephone)
      return;
      
  }

  
}
