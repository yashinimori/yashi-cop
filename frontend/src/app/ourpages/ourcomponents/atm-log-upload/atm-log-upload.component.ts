import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ClaimView } from '../../../share/models/claim-view.model';
import { HttpService } from '../../../share/services/http.service';
import { forkJoin, Subscription } from 'rxjs';
import { ErrorService } from '../../../share/services/error.service';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';


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
  loadingUpload = false;
  filesArr: Array<any> = new Array<any>();
  observableArrFiles: Array<any> = new Array<any>();
  selectedFile: any;
  //acceptFiles = 'application/txt/, application/pdf, image/*, application/msword, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';
  acceptFiles = 'application/txt/*';

  constructor(private httpService: HttpService, private toastrService: NbToastrService, private errorService: ErrorService) {
    this.claimsData = new Array<ClaimView>();
  }

  atmlogUploadSubscription: Subscription = new Subscription();
    
  ngOnInit(): void {
    this.role = localStorage.getItem('role');
  }
     
  ngOnDestroy(): void {
    this.atmlogUploadSubscription.unsubscribe();
  }

  createObservableArray(data) {
    return this.httpService.uploadATMlog(data);
  }

  showToast(status: NbComponentStatus, position, text: string) {
    this.toastrService.show(status, text, { status, position});
  }

  fileChanged(e) {
    this.selectedFile = e.target.files[0];
    if(this.selectedFile.size > 50000000) {
      alert('Файл занадто великий!');
    } else {
      this.filesArr.push(this.selectedFile);
      this.observableArrFiles.push(this.createObservableArray(this.selectedFile));
    }
  }

  deleteAttachedFile(file:any) {
    this.filesArr.splice(this.filesArr.indexOf(this.filesArr.find(e=> e == file)), 1);
  }

  onClickUploadLogs() {
    this.loadingUpload = true;
    //let data = this.filesArr[0];
    this.atmlogUploadSubscription = forkJoin(this.observableArrFiles).subscribe({
      next: (response: any) => {
        this.filesArr = new Array();
        this.observableArrFiles = new Array();
      },
      error: error => {
        this.loadingUpload = false;
        this.errorService.handleError(error);
        this.errorService.handleErrorToast(error);
        console.error('There was an error!', error);
      },
      complete: () => {
        this.loadingUpload = false;
        this.showToast('success', 'bottom-end', 'Всі файли успішно завантажені!');
      }
    });
  }
}
