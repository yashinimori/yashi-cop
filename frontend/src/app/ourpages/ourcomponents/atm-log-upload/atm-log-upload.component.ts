import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';
import { ClaimView } from '../../../share/models/claim-view.model';
import { DatePipe } from '@angular/common';
import { TransferService } from '../../../share/services/transfer.service';
import { HttpService } from '../../../share/services/http.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'ngx-atm-log-upload',
  templateUrl: './atm-log-upload.component.html',
  styleUrls: ['./atm-log-upload.component.scss']
})
export class ATMlogUploadComponent implements OnInit, OnDestroy {
  claimsData: Array<ClaimView>;
  settings: any;
  source: LocalDataSource;
  role: string;
  filesArr: Array<any> = new Array<any>();
  selectedFile: any;
  //acceptFiles = 'application/txt/, application/pdf, image/*, application/msword, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';
  acceptFiles = 'application/txt/*';

  constructor(private datePipe: DatePipe, 
    private transferService: TransferService,
    private router: Router,
    private httpService: HttpService) {
    this.claimsData = new Array<ClaimView>();
  }

  atmlogUploadSubscription: Subscription = new Subscription();
    
  ngOnInit(): void {
    this.role = localStorage.getItem('role');
  }
     
  ngOnDestroy(): void {
    this.atmlogUploadSubscription.unsubscribe();
  }

  fileChanged(e) {
    this.selectedFile = e.target.files[0];
    if(this.selectedFile.size > 50000000) {
      alert('Файл занадто великий!');
    } else {
      this.filesArr.push(this.selectedFile);
    }
  }

  deleteAttachedFile(file:any) {
    this.filesArr.splice(this.filesArr.indexOf(this.filesArr.find(e=> e == file)), 1);
  }

  onClickUploadLogs() {
    let data = this.filesArr[0];
    console.log(data);
    this.httpService.uploadATMlog(data).subscribe({
      next: (response: any) => {
        console.log('ok');
        console.log(response); 
        this.filesArr = [];
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
       
      }
    });
  }

  

}
