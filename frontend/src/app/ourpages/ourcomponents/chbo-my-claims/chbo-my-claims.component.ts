import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ClaimView } from '../../../share/models/claim-view.model';
import { DatePipe } from '@angular/common';
import { TransferService } from '../../../share/services/transfer.service';
import { HttpService } from '../../../share/services/http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FieldsStatus } from '../../../share/models/fieldsStatus.model';
import * as FileSaver from 'file-saver';

@Component({
    selector: 'app-chbo-my-claims',
    templateUrl: './chbo-my-claims.component.html'
})
export class ChboMyClaimsComponent implements OnInit, OnDestroy {
  claimsData: Array<ClaimView>;
  settings: any;
  source: LocalDataSource;
  role: string;
  pagerSize = 10;
  fieldsStatus: FieldsStatus;
  routeParamsStatus: any;

  constructor(private datePipe: DatePipe, 
    private transferService: TransferService,
    private router: Router,
    private httpServise: HttpService,
    private activatedRoute: ActivatedRoute,) {
    this.claimsData = new Array<ClaimView>();
  }

  claimsSubscription: Subscription = new Subscription();
  subscription1: Subscription = new Subscription();
  
  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onUserRowSelect(event): void {
    this.transferService.cOPClaimID.next(event.data.id);
    this.router.navigate(['cop', 'cabinet', 'single-claim']);
  }

  ngOnInit(): void {
    this.subscription1 = this.activatedRoute.params.subscribe(routeParams => {
      // (routeParams.id);
      this.routeParamsStatus = routeParams.status;
      this.role = localStorage.getItem('role');
      this.generateStatusFields();

      this.setSettingsGrid(this.role);
      this.getClaimsData(this.routeParamsStatus);
    });
    // this.generateStatusFields();
    // this.setSettingsGrid(this.role);
    // this.getClaimsData();
  }

  refresh_claim(){
    this.getClaimsData(this.routeParamsStatus);
  }

  setSettingsGrid(role:string){
    switch(role){
      case 'admin':
      case 'chargeback_officer':  {
        this.settings = {
          pager:{perPage: this.pagerSize},
          //hideSubHeader: true,
          actions:{
            add: false,
            edit: false,
            delete: false,
          },
          columns: {
            id: {
              title: 'ID',
              type: 'string',
            },
            pan: {
              title: 'Номер карти',
              type: 'string',
            },
            trans_date: {
              title: 'Дата транзакції',
              valuePrepareFunction: (trans_date) => {
                if(trans_date)
                  return this.datePipe.transform(new Date(trans_date), 'dd-MM-yyyy hh:mm:ss');
                else
                  return '';
              }
            },      
            merch_name_ips: {
              title: "Назва торговця",
              type: 'string',
            },
            term_id: {
              title: "Ім'я терміналу",
              type: 'string',
            },
            trans_amount: {
              title: "Cума",
              type: 'number',
            },
            trans_currency: {
              title: "Валюта",
              type: 'string',
            },
            auth_code: {
              title: "Код авторизації",
              type: 'number',
            },
            claim_reason_code: {
              title: "Reason Code",
              type: 'number',
            },
            status: {
              title: "Статус",
              type: 'string',
            },
            action_needed: {
              title: "Індикатор",
              type: 'string',
            },
            result: {
              title: "Результат",
              type: 'string',
            },
            due_date: {
              title: 'Кінцевий термін претензії',
              valuePrepareFunction: (due_date) => {
                if(due_date)
                  return this.datePipe.transform(new Date(due_date), 'dd-MM-yyyy hh:mm:ss');
                else
                  return '';
              }
            },
      
          },
        };
      }
    }
  }

  getClaimsData(s) {
    this.claimsData = new Array<ClaimView>();
    let self = this;
    let pageSize = 0;
    let pageNumber = 0;
    this.claimsSubscription = this.httpServise.getClaimList(pageSize, pageNumber).subscribe({
      next: (response: any) => {
        let data: any;
        if(pageSize > 0 && pageNumber > 0)
          data = response.results;
        else
        data = response;
        data.forEach(el => {
          //Тут иф на проверку статуса
          // console.log('INLOOP STATUS  '+ s)
          // console.log('INLOOP STAGE  '+ el['status']['stage'])
          if(el['status']['stage'] === s){
            let t = new ClaimView();
            
            t.id = el['id'];
            t.pan = el['pan'];
            t.trans_date = el['trans_date'];
            t.term_id = el['term_id'];
            t.trans_amount = el['trans_amount'];
            t.trans_currency = el['trans_currency'];
            t.auth_code = el['trans_approval_code'];
            t.claim_reason_code = el['reason_code'];
            t.status = el['status']['name'];
            t.action_needed = el['action_needed'];
            t.result = el['result'];
            t.due_date = el['due_date'];
            t.ch_comments = el['ch_comments'];

            let m = el['merchant'];
            if(m) 
              t.merch_name_ips = m['name_ips'];
            self.claimsData.push(t);
            
            //до сюда
          }
        });
        self.source = new LocalDataSource();
        //self.source.setPaging(1, 5);
        self.source.load(self.claimsData);
        //self.source .refresh();
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
      }
    });
  }

  ngOnDestroy(): void {
    this.claimsSubscription.unsubscribe();
    this.subscription1.unsubscribe();
  }

  generateStatusFields() {
    this.fieldsStatus = new FieldsStatus();
    this.fieldsStatus.setStatusByRole(this.role);
  }

  public createReport(){
    if(this.claimsData){
      let str = '';
      str += 'ID;';
      str += 'Номер карти;';
      str += 'Дата транзакції;';
      str += 'Назва торговця;';
      str += "Ім'я терміналу;";
      str += 'Cума;';
      str += 'Валюта;';
      str += 'Код авторизації;';
      str += 'Reason Code;';
      str += 'Статус;';
      str += 'Індикатор;';
      str += 'Результат;';
      str += 'Кінцевий термін претензії';
      str += '\r\n';
      this.claimsData.forEach(el=>{

        // str += `${el['id']};`;
        // str += `${el['pan']};`;
        // str += `${el['trans_date']};`;
        // str += `${el['merch_name_ips']};`;
        // str += `${el['term_id']};`;
        // str += `${el['trans_amount']};`;
        // str += `${el['trans_currency']};`;
        // str += `${el['auth_code']};`;
        // str += `${el['claim_reason_code']};`;
        // str += `${el['status']};`;
        // str += `${el['action_needed']};`;
        // str += `${el['result']};`;
        // str += `${el['due_date']}`;

        str += `${this.getValueToReport(el['id'])};`;
        str += `'${this.getValueToReport(el['pan'])};`;
        str += `${this.getValueToReportDate(el['trans_date'])};`;
        str += `${this.getValueToReport(el['merch_name_ips'])};`;
        str += `${this.getValueToReport(el['term_id'])};`;
        str += `${this.getValueToReport(el['trans_amount'])};`;
        str += `${this.getValueToReport(el['trans_currency'])};`;
        str += `${this.getValueToReport(el['auth_code'])};`;
        str += `${this.getValueToReport(el['claim_reason_code'])};`;
        str += `${this.getValueToReport(el['status'])};`;
        str += `${this.getValueToReport(el['action_needed'])};`;
        str += `${this.getValueToReport(el['result'])};`;
        str += `${this.getValueToReportDate(el['due_date'])}`;

        str += '\r\n';
      }); 
      var blob = new Blob([str], {type: "text/plain;charset=utf-8"});
      let filename = `report_${this.datePipe.transform(new Date(), 'yyyy-MM-dd_HH-mm-ss.SSS')}_${this.routeParamsStatus}.txt`;
      FileSaver.saveAs(blob, filename);
    }
  }

  getValueToReport(val: any){
    if(val){
      return val;
    } else {
      return '';
    }
  }

  getValueToReportDate(val: any){
    if(val){
      return this.datePipe.transform(new Date(val), 'dd-MM-yyyy hh:mm:ss');
    } else {
      return '';
    }
  }

}
