import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ClaimView } from '../../../share/models/claim-view.model';
import { HttpService } from '../../../share/services/http.service';
import { Subscription } from 'rxjs';
import { ErrorService } from '../../../share/services/error.service';


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

  constructor(private httpService: HttpService, private errorService: ErrorService) {
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
    this.atmlogUploadSubscription = this.httpService.uploadATMlog(data).subscribe({
      next: (response: any) => {
        this.filesArr = [];
      },
      error: error => {
        this.errorService.handleError(error);
        console.error('There was an error!', error);
      },
      complete: () => {
       
      }
    });
  }
}
