import {Component, OnInit, OnDestroy} from '@angular/core';
import {Authorization} from '../../share/models/authorization.model';
import {AuthService} from '../../share/services/auth.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'ngx-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit, OnDestroy {
  public data: Authorization;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.data = new Authorization();
  }

  getTokenSubscription: Subscription = new Subscription();

  ngOnInit(): void {
  }

  OnInit() {
    this.data = new Authorization();
  }

  enter() {

    if (this.data.confirm_password === this.data.password) {
      const uid = this.activatedRoute.snapshot.paramMap.get('uid');
      const token = this.activatedRoute.snapshot.paramMap.get('token');
      let d = {
        "new_password": this.data.password,
        "re_new_password": this.data.confirm_password,
        uid,
        token,
      };

      this.getTokenSubscription = this.authService.setPassword(d).subscribe({
        next: (response: any) => {
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
