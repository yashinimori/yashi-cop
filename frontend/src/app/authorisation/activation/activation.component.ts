import { Component, OnInit, OnDestroy } from '@angular/core';
import { Authorization } from '../../share/models/authorization.model';
import { AuthService } from '../../share/services/auth.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent implements OnInit {
  
  constructor(private authService: AuthService, 
    private activatedRoute: ActivatedRoute,
    private router: Router) {
  }
  
  getTokenSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    console.log('ActivationComponent  ngOnInit');

    let uid = this.activatedRoute.snapshot.paramMap.get('uid');
    let token = this.activatedRoute.snapshot.paramMap.get('token');

    this.setActivated(uid, token);
  }
  

  setActivated(uid: any, token: any){

    let d = {
      "uid": uid,
      "token": token
    }
    this.authService.userActivated(d).subscribe({
      next: (response: any) => {
        console.log('userActivated'); 
        console.log(response); 
        setTimeout(()=>{
          //this.router.navigate(['auth', 'login']);
        }, 3000);
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
        
      }
    });

  }

}