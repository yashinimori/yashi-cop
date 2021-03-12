import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { TransferService } from '../../../share/services/transfer.service';
import {Location} from '@angular/common';

@Component({
  selector: 'ngx-transactions-info',
  templateUrl: './transactions-info.component.html',
  styleUrls: ['./transactions-info.component.scss']
})
export class TransactionsInfoComponent implements OnInit, OnDestroy {

  constructor(private transferService: TransferService, private _location: Location) { }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler($event) {
    if (this.transactionId && this.transactionId != 0) {
      localStorage.setItem('transactionId', JSON.stringify(this.transactionId));
    }
  }

  transactionId: number;
  role:any;
  selectedTransaction:any = {
    "id": 1,
    "number": "668",
    "pan": "5001007068569876",
    "date": "2020-12-15T00:00:02Z",
    "time":  "12:21",
    "amnt": "134",
    "curr": "uah",
    "auth_code": "000001",
    "result":  "-1"
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    if(localStorage.getItem('transactionId')) {
      this.transactionId = Number(localStorage.getItem('transactionId'));
    } else {
      this.transactionId = this.transferService.transactionID.getValue();
    }
    
  }

  goBack() {
    this._location.back();
  }

  ngOnDestroy(): void {
    localStorage.removeItem('transactionId');
  }

}
