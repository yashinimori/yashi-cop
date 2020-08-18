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
  selector: 'ngx-claims-analysis',
  templateUrl: './claims-analysis.component.html',
  styleUrls: ['./claims-analysis.component.scss']
})
export class ClaimsAnalysisComponent implements OnInit, OnDestroy {
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

  claimsAnalysisSubscription: Subscription = new Subscription();
  
  
  onUserRowSelect(event): void {
    this.transferService.cOPClaimID.next(event.data.id);
    //this.router.navigate(['ourpages', 'ourcomponents', 'single-claim']);
  }

  ngOnInit(): void {
    
    this.role = localStorage.getItem('role');
    console.log('ClaimsAnalysisComponent role ' +this.role);

    this.setSettingsGrid(this.role);
    this.getClaimsAnalysisData();
    this.hideColumnForUser(this.role);
  }


  hideColumnForUser(role:string){
    if(role && (role == 'cardholder' || role == 'user')){
        delete this.settings.columns.id;
    }
  }

  setSettingsGrid(role:string){
    console.log('setSettingsGrid(c:string)' + role);

    switch(role){
      case 'admin':
      case 'chargeback_officer':  {
        this.settings = {
          pager:{perPage: 5},
          //hideSubHeader: true,
          actions:{
            add: false,
            edit: false,
            delete: false,
          },
          columns: {
          //   trans_start: {
          //     title: 'Дата транзакції',
          //     valuePrepareFunction: (trans_date) => {
          //       if(trans_date)
          //         return this.datePipe.transform(new Date(trans_date), 'dd-MM-yyyy hh:mm:ss');
          //       else
          //         return '';
          //     }
          //   }, 
            pan: {
              title: 'Номер карти',
              type: 'string',
            },
            // trans_date: {
            //   title: 'Дата транзакції',
            //   valuePrepareFunction: (trans_date) => {
            //     if(trans_date)
            //       return this.datePipe.transform(new Date(trans_date), 'dd-MM-yyyy hh:mm:ss');
            //     else
            //       return '';
            //   }
            // },      
            
      
          },
        };
      }
      break;
      
      default: {
        this.settings = {
          actions:{
            add: false,
            edit: false,
            delete: false,
          },
        };
      }

    }
    

  }

  getClaimsAnalysisData() {
    console.log('getClaimsAnalysisData()'); 
    this.claimsData = new Array<ClaimView>();
    let self = this;
    this.claimsAnalysisSubscription = this.httpService.getClaimsAnalisysList(10, 1).subscribe({
      next: (response: any) => {
        console.log('loaded Claims Analysis'); 
        console.log(response);

        response.results.forEach(el => {
          let t = new ClaimView();
             
          t.pan = el['pan'];
          
          self.claimsData.push(t);
          
          //console.log(t);

        });

        //self.source = new LocalDataSource(self.claimsData);
        self.source = new LocalDataSource();
        //self.source.setPaging(1, 5);
        self.source.load(self.claimsData);
        //self.source .refresh();

        console.log(self.source);
        
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
       
      }
    });
  }

  ngOnDestroy(): void {
    this.claimsAnalysisSubscription.unsubscribe();
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
    //let data = {log: this.filesArr[0]};
    let data = this.filesArr[0];
    console.log(data);
    this.httpService.uploadATMlog(data).subscribe({
      next: (response: any) => {
        console.log('ok');
        console.log(response); 
        this.filesArr = [];
        this.getClaimsAnalysisData();
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
       
      }
    });
  }

  

}
