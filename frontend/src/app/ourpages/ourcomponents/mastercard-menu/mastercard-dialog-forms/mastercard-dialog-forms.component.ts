import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { ErrorService } from '../../../../share/services/error.service';
import { HttpService } from '../../../../share/services/http.service';
import { ToastService } from '../../../../share/services/toast.service';

@Component({
  selector: 'ngx-mastercard-dialog-forms',
  templateUrl: './mastercard-dialog-forms.component.html',
  styleUrls: ['./mastercard-dialog-forms.component.scss']
})
export class MastercardDialogFormsComponent implements OnInit, OnDestroy {

  constructor(private httpService: HttpService, private toastService: ToastService,
    private errorService: ErrorService, protected dialogRef: NbDialogRef<MastercardDialogFormsComponent>) { }
 
  selectedDisputeType: any = 1;
  disputAmount: any;
  selectedReasonCode:any;
  currentCurrency:any;
  reasonCodesArr: Array<any> = new Array<any>();
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();

  listCurrency = [
    {id:1, caption:"UAH"},
    {id:2, caption:"USD"},
    {id:3, caption:"EUR"}
  ];

  disputeTypesArr = [
    {
      title: 'Chargeback',
      value: 1
    },
    {
      title: 'Retrieval Request',
      value: 2
    },
    {
      title: 'Case',
      value: 3
    }
  ];

  ngOnInit(): void {
    this.getReasonCodes();
  }

  getReasonCodes() {
    this.subscription1 = this.httpService.getReasonCodes().subscribe({
      next: (response: any) => {
        this.reasonCodesArr = response.results;
        console.log(this.reasonCodesArr);
      },
      error: error => {
        this.errorService.handleError(error);
        console.error('There was an error!', error);
      },
      complete: () => {
      }
    });
  }

  close(status) {
    this.dialogRef.close(status);
  }

  createClaim() {
    const claim = {
      "disputedAmount": this.disputAmount,
      "disputedCurrency": this.currentCurrency,
      "claimType": "Standard",
      "clearingTransactionId": "U7dImb1ncs24LKNU9dDpl+FHlPzyfYOOvS5PijTlO6wHH09l7aiVJ1KJHp3sWPUHH0l90J1U82DGrE3hq72ARA=ccCnaMDqmto4wnL+BSUKSdzROqGJ7YELoKhEvluycwKNg3XTzSfaIJhFDkl9hW081B5tTqFFiAwCpcocPdB2My4t7DtSTk63VXDl1CySA8Y=",
      "authTransactionId": "aaCnaMDqmto4wnL+BSUKSdzROqGJ7YELoKhEvluycwKNg3XTzSfaIJhFDkl9hW081B5tTqFFiAwCpcocPdB2My4t7DtSTk63VXDl1CySA8Y="
    }
    this.subscription2 = this.httpService.createClaimMastercardApi(claim).subscribe({
      next: (response: any) => {
        this.reasonCodesArr = response.results;
        console.log(this.reasonCodesArr);
      },
      error: error => {
        this.errorService.handleError(error);
        this.errorService.handleErrorToast(error);
        console.error('There was an error!', error);
      },
      complete: () => {
        this.toastService.showSuccessToast();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }

}
