import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorService } from '../../../../../share/services/error.service';
import { HttpService } from '../../../../../share/services/http.service';
import { TransferService } from '../../../../../share/services/transfer.service';

@Component({
  selector: 'ngx-edit-bank-user',
  templateUrl: './edit-bank-user.component.html',
  styleUrls: ['./edit-bank-user.component.scss']
})
export class EditBankUserComponent implements OnInit, OnDestroy {

  constructor(private transferService: TransferService,
    private router: Router,
    private httpServise: HttpService, private errorService: ErrorService) { }
 
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler($event) {
    if (this.bankUserID && this.bankUserID != 0) {
      localStorage.setItem('bankUserID', JSON.stringify(this.bankUserID));
    }
  }
  bankUserID: number;
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  editedBankUser: any;
  currentBankUser: any;
  isUiLoad: boolean = false;
  isEdit: boolean = false;
  banksList = new Array<any>();

  ngOnInit(): void {
    if(localStorage.getItem('bankUserID')) {
      this.bankUserID = Number(localStorage.getItem('bankUserID'));
    } else {
      this.bankUserID = this.transferService.bankUserID.getValue();
    }
    this.loadBankUser();
  }

  loadBankUser() {
    this.subscription1 = this.httpServise.getBankUserById(this.bankUserID).subscribe({
      next: (response: any) => {
        this.editedBankUser = JSON.parse(JSON.stringify(response.user));
        this.currentBankUser = JSON.parse(JSON.stringify(response.user));
        this.editedBankUser.unit = response.unit;
        this.currentBankUser.unit = response.unit;
      },
      error: error => {
        this.errorService.handleError(error);
        console.error('There was an error!', error);
      },
      complete: () => { 
        this.isUiLoad = true; 
      }
    });
  }

  goBack() {
    this.router.navigate(['cop', 'cabinet', 'bank-single']);
  }

  editBankUser() {
    this.isEdit = true;
    this.editedBankUser = JSON.parse(JSON.stringify(this.currentBankUser));
  }

  closeEditBankUser() {
    this.isEdit = false;
  }

  updateBankUser() {
    alert('Пока не готово');
  }

  ngOnDestroy(): void {
    localStorage.removeItem('bankUserID');
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
