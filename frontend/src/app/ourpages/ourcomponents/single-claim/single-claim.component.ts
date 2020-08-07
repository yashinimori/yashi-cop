import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransferService } from '../../../share/services/transfer.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../share/services/http.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-single-claim',
  templateUrl: './single-claim.component.html',
  styleUrls: ['./single-claim.component.scss']
})
export class SingleClaimComponent implements OnInit, OnDestroy {

  constructor(private transferService: TransferService, private httpService: HttpService,
    private router: Router) { }

    cOPClaimID: string;
    isNewRecord: boolean = false;
    getClaimSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.cOPClaimID = this.transferService.cOPClaimID.getValue();
    
    this.isNewRecord = this.cOPClaimID.length == 0 ? true : false;
    
  }

  ngOnDestroy(): void {
    this.transferService.cOPClaimID.next('');
    this.getClaimSubscription.unsubscribe();
  }

}
