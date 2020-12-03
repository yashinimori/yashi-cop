import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorService } from '../../../../../share/services/error.service';
import { HttpService } from '../../../../../share/services/http.service';
import { TransferService } from '../../../../../share/services/transfer.service';

@Component({
  selector: 'ngx-edit-atm',
  templateUrl: './edit-atm.component.html',
  styleUrls: ['./edit-atm.component.scss']
})
export class EditAtmComponent implements OnInit, OnDestroy {

  constructor(private transferService: TransferService,
    private router: Router,
    private httpServise: HttpService, private errorService: ErrorService) { }
 
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler($event) {
    if (this.atmId && this.atmId != 0) {
      localStorage.setItem('atmId', JSON.stringify(this.atmId));
    }
  }
  atmId: number;
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  editedAtm: any;
  currentAtm: any;
  isUiLoad: boolean = false;
  isEdit: boolean = false;
  banksList = new Array<any>();

  ngOnInit(): void {
    if(localStorage.getItem('atmId')) {
      this.atmId = Number(localStorage.getItem('atmId'));
    } else {
      this.atmId = this.transferService.atmID.getValue();
    }
    this.loadAtm();
  }

  loadAtm() {
    this.subscription1 = this.httpServise.getAtm(this.atmId).subscribe({
      next: (response: any) => {
        this.editedAtm = JSON.parse(JSON.stringify(response));
        this.currentAtm = JSON.parse(JSON.stringify(response));
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
        this.currentAtm.bankCustom = this.banksList.filter(e=>e.id==this.currentAtm.bank)[0];
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
    this.router.navigate(['cop', 'cabinet', 'bank-single']);
  }

  editAtm() {
    this.isEdit = true;
    this.editedAtm = JSON.parse(JSON.stringify(this.currentAtm));
  }

  closeEditAtm() {
    this.isEdit = false;
  }

  updateAtm() {
    alert('Пока не готово');
  }

  ngOnDestroy(): void {
    localStorage.removeItem('atmId');
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
