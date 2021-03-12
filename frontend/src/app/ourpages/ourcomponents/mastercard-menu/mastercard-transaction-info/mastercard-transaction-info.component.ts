import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { MastercardDialogFormsComponent } from '../mastercard-dialog-forms/mastercard-dialog-forms.component';

@Component({
  selector: 'ngx-mastercard-transaction-info',
  templateUrl: './mastercard-transaction-info.component.html',
  styleUrls: ['./mastercard-transaction-info.component.scss']
})
export class MastercardTransactionInfoComponent implements OnInit {

  constructor(private dialogService: NbDialogService) { }
  transactionDetailsArr: Array<any>;

  transactionDetails = {
    'PAN': '4000002222222222',
    'TransDate': '2020-11-19T12:15:59.761294Z',
    'Amount': '100',
    'Currency': 'usd',
    'MerchantID': '1',
    'MCC': 'test',
    'TerminalID': '1',
    'ARN': '1'
  }

  caseId = '12';

  ngOnInit(): void {
    this.transactionDetailsArr = this.parseObjectToArray(this.transactionDetails);
  }

  parseObjectToArray(obj) {
    let arr = [];
    for(let i = 0; i < Object.keys(obj).length; i++) {
      arr[i] = {
        title: Object.keys(obj)[i],
        value: obj[Object.keys(obj)[i]]
      }
    }
    return arr;
  }

  openDialog() {
    this.dialogService.open(MastercardDialogFormsComponent, {})
      .onClose.subscribe(result => result && console.log(result));
  }

}
