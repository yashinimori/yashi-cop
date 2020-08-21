import { Component, OnInit } from '@angular/core';
import { Registration } from '../../share/models/registration.model';
import { HttpService } from '../../share/services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})

export class RegistrationComponent implements OnInit {
  public data: Registration;


  // RegistrationData: RegistrationView;
  constructor(private httpService: HttpService,
              private router: Router,) {
    this.data = new Registration();
  
  }


  ngOnInit(): void {
  //  console.log(this.data.email.length)
   console.log(this.data.role)
  }


  createUser() {
    console.log(this.data);
    // this.data.email.length
    this.httpService.createNewUser(this.data).subscribe({
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

    if (!this.data.phone)
      return;
      
  }

  
}
