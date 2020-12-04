import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorService } from '../../../../../share/services/error.service';
import { HttpService } from '../../../../../share/services/http.service';
import { TransferService } from '../../../../../share/services/transfer.service';
import {Location} from '@angular/common';

@Component({
  selector: 'ngx-edit-merchant',
  templateUrl: './edit-merchant.component.html',
  styleUrls: ['./edit-merchant.component.scss']
})
export class EditMerchantComponent implements OnInit, OnDestroy {

  constructor(private transferService: TransferService,
    private router: Router, private _location: Location,
    private httpServise: HttpService, private errorService: ErrorService) { }
 
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler($event) {
    if (this.merchantId && this.merchantId != 0) {
      localStorage.setItem('merchantId', JSON.stringify(this.merchantId));
    }
  }
  merchantId: number;
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  editedMerchant: any;
  currentMerchant: any;
  isUiLoad: boolean = false;
  isEdit: boolean = false;
  banksList = new Array<any>();

  ngOnInit(): void {
    if(localStorage.getItem('merchantId')) {
      this.merchantId = Number(localStorage.getItem('merchantId'));
    } else {
      this.merchantId = this.transferService.merchantID.getValue();
    }
    this.loadMerchant();
  }

  loadMerchant() {
    this.subscription1 = this.httpServise.getMerchantById(this.merchantId).subscribe({
      next: (response: any) => {
        this.editedMerchant = JSON.parse(JSON.stringify(response));
        this.currentMerchant = JSON.parse(JSON.stringify(response));
      },
      error: error => {
        this.errorService.handleError(error);
        console.error('There was an error!', error);
      },
      complete: () => { 
        this.getListBanks(); 
      }
    });
  }

  private getListBanks() {
    this.banksList = new Array<any>();
    this.subscription2 = this.httpServise.getAllBank().subscribe({
      next: (response: any) => {
        this.banksList = response;
        this.currentMerchant.bankCustom = new Array();
        this.currentMerchant.bank.forEach(bankId=> {
          this.currentMerchant.bankCustom.push(this.banksList.filter(e=>e.id==bankId)[0]);
        });
        this.currentMerchant.bankCustom.push(response[0]);
        //this.currentMerchant.bankCustom = this.banksList.filter(e=>e.id==this.currentMerchant.bank)[0];
      },
      error: error => {
        this.errorService.handleError(error);
        console.error('There was an error!', error);
      },
      complete: () => {
        this.isUiLoad = true; 
      },
    });
  }

  goBack() {
    this._location.back();
  }

  editMerchant() {
    this.isEdit = true;
    this.editedMerchant = JSON.parse(JSON.stringify(this.currentMerchant));
  }

  closeEditMerchant() {
    this.isEdit = false;
  }

  updateMerchant() {
    alert('Пока не готово');
  }

  ngOnDestroy(): void {
    localStorage.removeItem('merchantId');
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
