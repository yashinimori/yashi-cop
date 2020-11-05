import {Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { ErrorService } from '../../../share/services/error.service';
import { HttpService } from '../../../share/services/http.service';

@Component({
    selector: 'app-chbo-dashboard', 
    templateUrl: './chbo-dashboard.component.html',
    
})
export class ChboDashboardComponent implements OnInit, OnDestroy{
  all_new_claims: any;
  all_updated_claims: any;
  
  constructor(private httpServise: HttpService, private errorService: ErrorService){
  }

  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();

  ngOnInit(): void {
    this.all_new_claims = 0;
    this.all_updated_claims = 0;
    this.loadCountUpdatedClaims();
    this.loadCountNewClaims();
  }

  loadCountUpdatedClaims(){
    this.subscription1 = this.httpServise.getCountUpdatedClaims().subscribe({
      next: (response: any) => {
        this.all_updated_claims = response['updated_claims'];
      },
      error: error => {
        this.errorService.handleError(error);
        console.error('There was an error!', error);
      },
      complete: () => {
      }
    });
  }

  loadCountNewClaims(){
    this.subscription2 = this.httpServise.getCountNewClaims().subscribe({
      next: (response: any) => {
        this.all_new_claims = response['new_claims'];
      },
      error: error => {
        this.errorService.handleError(error);
        console.error('There was an error!', error);
      },
      complete: () => {
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }
}