import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ClaimView } from '../../../share/models/claim-view.model';
import { DatePipe } from '@angular/common';
import { TransferService } from '../../../share/services/transfer.service';
import { HttpService } from '../../../share/services/http.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FieldsStatus } from '../../../share/models/fieldsStatus.model';
import * as FileSaver from 'file-saver';
import { ErrorService } from '../../../share/services/error.service';
import { NbSearchService } from '@nebular/theme';

@Component({
  selector: 'ngx-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss']
})
export class ClaimsComponent implements OnInit, OnDestroy {
  claimsData: Array<ClaimView>;
  settings: any;
  source: LocalDataSource;
  role: string;
  pagerSize = 10;
  fieldsStatus: FieldsStatus;
  stageParam: string;
  loadingRefresh = false;
  loadingReport = false;
  viewModeTable = true;

  searchValue: string;

  items = [
    { title: 'us-on-us' },
    { title: 'us-on-them' },
    { title: 'them-on-us' },
  ];

  constructor(private datePipe: DatePipe,
    private transferService: TransferService,
    private router: Router,
    private searchService: NbSearchService,
    private httpServise: HttpService, private errorService: ErrorService) {
    this.claimsData = new Array<ClaimView>();
  }

  claimsSubscription: Subscription = new Subscription();
  searchSubscription: Subscription = new Subscription();

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  changeViewMode() {
    this.viewModeTable = !this.viewModeTable;
  }

  getClaimAccent(el) {
    let res = 'success';
    if (el.status == 'archive' || el.status == 'closed') {
      res = 'control';
    } else if (el.status == 'closed') {
      res = 'danger';
    } else if (el.status != 'archive' && el.status != 'closed') {
      res = 'success';
    }
    return res;
  }

  onUserRowSelect(event, el?: number): void {
    if (el == 2) {
      this.transferService.cOPClaimID.next(event.id);
    } else {
      this.transferService.cOPClaimID.next(event.data.id);
    }
    this.router.navigate(['cop', 'cabinet', 'single-claim']);
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    this.searchSubscription = this.transferService.searchValue.subscribe(data => {
      this.searchValue = data;
      if (this.searchValue != '') {
        this.getClaimsData();
      }
    });
    this.generateStatusFields();

    this.stageParam = '';
    let urlArr = this.router.url.split('/');
    this.stageParam = urlArr[urlArr.length - 1]

    this.setSettingsGrid(this.role);
    this.getClaimsData();
    this.hideColumnForUser(this.role);
  }

  hideColumnForUser(role: string) {
    if (role && (role == 'cardholder' || role == 'user')) {
      delete this.settings.columns.id;
    }
  }

  createNewClaimCb() {
    this.transferService.cOPClaimID.next('0');
    this.router.navigate(['cop', 'cabinet', 'single-claim']);
  }

  setUserCb() {

  }

  setSettingsGrid(role: string) {
    switch (role) {
      case 'chargeback_officer': {
        this.settings = {
          pager: { perPage: this.pagerSize },
          //hideSubHeader: true,
          actions: {
            add: false,
            edit: false,
            delete: false,
          },
          columns: {
            id: {
              title: 'ID',
              type: 'string',
            },
            // openClaim: {
            //    title: 'ID2',
            //    type: 'html',
            // },
            pan: {
              title: 'Номер карти',
              type: 'string',
            },
            trans_date: {
              title: 'Дата транзакції',
              sort: true,
              sortDirection: 'desc',
              valuePrepareFunction: (trans_date) => {
                if (trans_date)
                  //return this.datePipe.transform(new Date(trans_date), 'dd-MM-yyyy hh:mm:ss');
                  return this.datePipe.transform(new Date(trans_date), 'dd-MM-yyyy');
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
              title: "Дії",
              //type: 'string',
              valuePrepareFunction: (action_needed) => {
                if (action_needed && action_needed == true)
                  return 'Y';
                else
                  return 'N';
              }
            },
            flag: {
              title: "flag",
              type: 'string',
            },
            result: {
              title: "Результат",
              type: 'string',
            },
            due_date: {
              title: 'Кінцевий термін претензії',
              valuePrepareFunction: (due_date) => {
                if (due_date)
                  //return this.datePipe.transform(new Date(due_date), 'dd-MM-yyyy hh:mm:ss');
                  return this.datePipe.transform(new Date(due_date), 'dd-MM-yyyy');
                else
                  return '';
              }
            },
          },
        };
      }
        break;
      case 'admin':
      case 'сс_branch': {
        this.settings = {
          pager: { perPage: this.pagerSize },
          //hideSubHeader: true,
          actions: {
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
              width: '100px'
            },
            trans_date: {
              title: 'Дата транзакції',
              sort: true,
              sortDirection: 'desc',
              valuePrepareFunction: (trans_date) => {
                if (trans_date)
                  //return this.datePipe.transform(new Date(trans_date), 'dd-MM-yyyy hh:mm:ss');
                  return this.datePipe.transform(new Date(trans_date), 'dd-MM-yyyy');
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
              title: "Дії",
              //type: 'string',
              valuePrepareFunction: (action_needed) => {
                if (action_needed && action_needed == true)
                  return 'Y';
                else
                  return 'N';
              }
            },
            flag: {
              title: "flag",
              type: 'string',
            },
            result: {
              title: "Результат",
              type: 'string',
            },
            due_date: {
              title: 'Кінцевий термін претензії',
              valuePrepareFunction: (due_date) => {
                if (due_date)
                  //return this.datePipe.transform(new Date(due_date), 'dd-MM-yyyy hh:mm:ss');
                  return this.datePipe.transform(new Date(due_date), 'dd-MM-yyyy');
                else
                  return '';
              }
            },
          },
        };
      }
        break;
      case 'merchant':
      case 'cardholder':
      case 'user': {
        this.settings = {
          pager: { perPage: this.pagerSize },
          //hideSubHeader: true,
          actions: {
            add: false,
            edit: false,
            delete: false,
          },
          columns: {
            // id: {
            //   title: '#',
            //   type: 'string',
            //   hidden: true,
            //   filter: false,               
            // },
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
              sort: true,
              sortDirection: 'desc',
              valuePrepareFunction: (trans_date) => {
                if (trans_date)
                  //return this.datePipe.transform(new Date(trans_date), 'dd-MM-yyyy hh:mm:ss');
                  return this.datePipe.transform(new Date(trans_date), 'dd-MM-yyyy');
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
            // claim_reason_code: {
            //   title: "Reason Code",
            //   type: 'number',
            // },
            // status: {
            //   title: "Статус",
            //   type: 'string',
            // },
            // action_needed: {
            //   title: "Дії",
            //   //type: 'string',
            //   valuePrepareFunction: (action_needed) => {
            //     if(action_needed && action_needed == true)
            //       return 'Y';
            //     else
            //       return 'N';
            //   }
            // },
            // flag:{
            //   title: "flag",
            //   type: 'string',
            // },
            result: {
              title: "Результат",
              type: 'string',
            },
            due_date: {
              title: 'Кінцевий термін претензії',
              valuePrepareFunction: (due_date) => {
                if (due_date)
                  //return this.datePipe.transform(new Date(due_date), 'dd-MM-yyyy hh:mm:ss');
                  return this.datePipe.transform(new Date(due_date), 'dd-MM-yyyy');
                else
                  return '';
              }
            },
          },
          attr: {
            class: 'customTable'
          }
        };
      }
        break;
      default: {
        this.settings = {
          actions: {
            add: false,
            edit: false,
            sort: true,
            delete: false,
          },
        };
      }
    }
  }

  refresh_claim() {
    this.loadingRefresh = true;
    this.getClaimsData();
  }

  getClaimsData() {
    this.claimsData = new Array<ClaimView>();
    let self = this;
    let pageSize = 0;
    let pageNumber = 0;
    this.claimsSubscription = this.httpServise.getClaimList(pageSize, pageNumber).subscribe({
      next: (response: any) => {
        let data: any;

        if (pageSize > 0 && pageNumber > 0)
          data = response.results;
        else
          data = response;

        data.forEach(el => {
          let t = new ClaimView();

          if (this.role == 'chargeback_officer') {
            //this.transferService.cOPClaimID.next(el['id']);
            //this.router.navigate(['ourpages', 'ourcomponents', 'single-claim']);
            //t.openClaim = '<a href="/ourpages/ourcomponents/single-claim" target="_blank">'+el['id']+'</a>'
            //t.openClaim = '<a (click)="goToLink("/ourpages/ourcomponents/single-claim", '+ el['id'] + ')">'+el['id']+'</a>'
          }

          t.id = el['id'];
          t.pan = el['pan'];
          t.trans_date = el['trans_date'];
          t.term_id = el['term_id'];
          t.trans_amount = el['trans_amount'];
          t.trans_currency = el['trans_currency'];
          t.auth_code = el['trans_approval_code'];
          t.claim_reason_code = el['reason_code'];
          t.status = el.status['stage'];
          t.action_needed = el['action_needed'];
          t.result = el['result'];
          t.due_date = el['due_date'];
          t.ch_comments = el['ch_comments'];
          t.flag = el['flag'];

          let m = el['merchant'];
          if (m)
            t.merch_name_ips = m['name_ips'];

          if(this.role == 'chargeback_officer' || this.role == 'сс_branch') {
            if (this.searchValue != '') {
              for(let el in t) {
                if(this.searchFilter(this.searchValue, t[el])) {
                  self.claimsData.push(t);
                }
              } 
            } else {
              self.claimsData.push(t);
            }
          } else {
            self.claimsData.push(t);
          }
        });

        if (this.role == 'cardholder' && this.stageParam == 'all') {
          self.claimsData = self.claimsData.filter(i => i.status != 'archive' && i.status != 'closed');
        } else if (this.role == 'cardholder' && this.stageParam == 'archive') {
          self.claimsData = self.claimsData.filter(i => i.status == 'archive' || i.status == 'closed');
        } else if (this.role == 'merchant' && this.stageParam == 'all') {
          self.claimsData = self.claimsData.filter(i => i.status != 'archive' && i.status != 'closed');
        } else if (this.role == 'merchant' && this.stageParam == 'archive') {
          self.claimsData = self.claimsData.filter(i => i.status == 'archive' || i.status == 'closed');
        }
        // поиск без сервера
        if (this.searchValue != '') {
          self.source = new LocalDataSource();
          self.source.load(self.claimsData);
        } else {
          self.source = new LocalDataSource();
          self.source.load(self.claimsData);
        }


      },
      error: error => {
        this.loadingRefresh = false;
        this.errorService.handleError(error);
        console.error('There was an error!', error);
      },
      complete: () => {
        this.loadingRefresh = false;
      }
    });
  }

  clearSearch() {
    this.searchService.submitSearch('', 'globalSearch');
    this.transferService.searchValue.next('');
    this.getClaimsData();
  }

  private searchFilter(value: string, data) {
    const filterValue = value.toLowerCase();
    if (data == null || data == undefined) {
      return false;
    }
    return data.toString().toLowerCase().indexOf(filterValue) === 0;
  }

  ngOnDestroy(): void {
    this.claimsSubscription.unsubscribe();
    this.searchSubscription.unsubscribe();
  }

  generateStatusFields() {
    this.fieldsStatus = new FieldsStatus();
    this.fieldsStatus.setStatusByRole(this.role);
  }

  add_claim() {
    this.transferService.cOPClaimID.next('0');
    this.router.navigate(['cop', 'cabinet', 'single-claim']);
  }

  goToLink(url: string, id: string) {
    this.transferService.cOPClaimID.next(id);
    window.open(url, "_blank");
  }

  public createReport() {
    if (this.claimsData) {
      this.loadingReport = true;
      let str = '';

      str += 'ID;';
      str += 'Номер карти;';
      str += 'Дата транзакції;';
      str += 'Назва торговця;';
      str += "Ім'я терміналу;";
      str += 'Cума;';
      str += 'Валюта;';
      str += 'Код авторизації;';

      if (this.role != 'merchant' && this.role != 'cardholder' && this.role != 'user') {
        str += 'Reason Code;';
        str += 'Статус;';
        str += 'Дії;';
        str += 'flag;';
      }

      str += 'Результат;';
      str += 'Кінцевий термін претензії';
      str += '\r\n';

      this.claimsData.forEach(el => {
        str += `${this.getValueToReport(el['id'])};`;
        str += `'${this.getValueToReport(el['pan'])};`;
        str += `${this.getValueToReportDate(el['trans_date'])};`;
        str += `${this.getValueToReport(el['merch_name_ips'])};`;
        str += `${this.getValueToReport(el['term_id'])};`;
        str += `${this.getValueToReport(el['trans_amount'])};`;
        str += `${this.getValueToReport(el['trans_currency'])};`;
        str += `${this.getValueToReport(el['auth_code'])};`;

        if (this.role != 'merchant' && this.role != 'cardholder' && this.role != 'user') {
          str += `${this.getValueToReport(el['claim_reason_code'])};`;
          str += `${this.getValueToReport(el['status'])};`;
          str += `${this.getValueToReportBool(el['action_needed'])};`;
          str += `${this.getValueToReport(el['flag'])};`;
        }

        str += `${this.getValueToReport(el['result'])};`;
        str += `${this.getValueToReportDate(el['due_date'])}`;
        str += '\r\n';
      });

      var blob = new Blob([str], { type: "text/plain;charset=utf-8" });
      let filename = `report_${this.datePipe.transform(new Date(), 'yyyy-MM-dd_HH-mm-ss.SSS')}.txt`;
      this.loadingReport = false;
      FileSaver.saveAs(blob, filename);
    }
  }

  getValueToReport(val: any) {
    if (val) {
      return val;
    } else {
      return '';
    }
  }

  getValueToReportDate(val: any) {
    if (val) {
      //return this.datePipe.transform(new Date(val), 'dd-MM-yyyy hh:mm:ss');
      return this.datePipe.transform(new Date(val), 'dd-MM-yyyy');
    } else {
      return '';
    }
  }

  getValueToReportBool(val: any) {
    if (val) {
      return 'Y';
    } else {
      return 'N';
    }
  }

}