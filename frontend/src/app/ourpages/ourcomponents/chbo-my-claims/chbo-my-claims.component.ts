import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ClaimView } from '../../../share/models/claim-view.model';
import { DatePipe } from '@angular/common';
import { TransferService } from '../../../share/services/transfer.service';
import { HttpService } from '../../../share/services/http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FieldsStatus } from '../../../share/models/fieldsStatus.model';
import * as FileSaver from 'file-saver';
import { ErrorService } from '../../../share/services/error.service';
import { API, APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'app-chbo-my-claims',
    templateUrl: './chbo-my-claims.component.html',
    styleUrls: ['./chbo-my-claims.component.scss']
})
export class ChboMyClaimsComponent implements OnInit, OnDestroy, AfterViewInit {
  claimsData: Array<ClaimView>;
  settings: any;
  source: LocalDataSource;
  role: string;
  pagerSize = 10;
  loadingRefresh = false;
  loadingReport = false;
  fieldsStatus: FieldsStatus;
  routeParamsStatus: any;

  constructor(private datePipe: DatePipe, 
    private transferService: TransferService,
    private router: Router, private translate: TranslateService,
    private httpServise: HttpService,
    private activatedRoute: ActivatedRoute, private errorService: ErrorService) {
    this.claimsData = new Array<ClaimView>();
  }
 
  @ViewChild('table', { static: true }) table: APIDefinition;
  isUiLoad:boolean = false;

  public configuration: Config;
  public columns: Columns[] = [
    {key: 'id', title: 'ID'},
    {key: 'pan', title: 'Номер карти'},
    {key: 'trans_date', title: 'Дата транзакції'},
    {key: 'merch_name_ips', title: 'Назва торговця'},
    {key: 'term_id', title: "Ім'я терміналу"},
    {key: 'trans_amount', title: 'Cума'},
    {key: 'trans_currency', title: 'Валюта'},
    {key: 'auth_code', title: 'Код авторизації'},
    {key: 'claim_reason_code', title: 'Reason Code'},
    {key: 'status', title: 'Статус'},
    {key: 'action_needed', title: 'Індикатор'},
    {key: 'result', title: 'Результат'},
    {key: 'due_date', title: 'Кінцевий термін претензії'}
  ];
  public dataTable = new Array();
  dataTest = new Array();
  // dataTest = [{action_needed: false,
  //   auth_code: "112322",
  //   ch_comments: undefined,
  //   claim_reason_code: "139",
  //   due_date: null,
  //   id: 26,
  //   pan: "4000002222222222",
  //   result: null,
  //   status: "Медиация ответ торговца",
  //   term_id: "12321323",
  //   trans_amount: "624.00",
  //   trans_currency: "usd",
  //   trans_date: "2020-11-18T00:00:02Z"}]
  checked = new Set(['id', 'pan', 'trans_date', 'merch_name_ips', 'term_id',
   'trans_amount', 'trans_currency', 'auth_code', 'claim_reason_code',
    'status', 'action_needed', 'result', 'due_date']);
  columnsCopy: Columns[] = [];
  public pagination = {
    limit: 10,
    offset: 0,
    count: -1,
    sort: '',
    order: '',
  };

  claimsSubscription: Subscription = new Subscription();
  subscription1: Subscription = new Subscription();
  translationChangeSubscription: Subscription = new Subscription();
  
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
    this.isUiLoad = false;
    this.translationChangeSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.setColumns();
      this.getRouteParams();
    });
    this.setColumns();
    this.getRouteParams();

    // this.generateStatusFields();
    // this.setSettingsGrid(this.role);
    // this.getClaimsData();
  }

  setColumns() {
    this.columns = [
      {key: 'id', title: this.translate.instant('chbo_my_claims_component.text16')},
      {key: 'pan', title: this.translate.instant('chbo_my_claims_component.text17')},
      {key: 'trans_date', title: this.translate.instant('chbo_my_claims_component.text18')},
      {key: 'merch_name_ips', title: this.translate.instant('chbo_my_claims_component.text19')},
      {key: 'term_id', title: this.translate.instant('chbo_my_claims_component.text20')},
      {key: 'trans_amount', title: this.translate.instant('chbo_my_claims_component.text21')},
      {key: 'trans_currency', title: this.translate.instant('chbo_my_claims_component.text22')},
      {key: 'auth_code', title: this.translate.instant('chbo_my_claims_component.text23')},
      {key: 'claim_reason_code', title: this.translate.instant('chbo_my_claims_component.text24')},
      {key: 'status', title: this.translate.instant('chbo_my_claims_component.text25')},
      {key: 'action_needed', title: this.translate.instant('chbo_my_claims_component.text26')},
      {key: 'result', title: this.translate.instant('chbo_my_claims_component.text27')},
      {key: 'due_date', title: this.translate.instant('chbo_my_claims_component.text28')}
    ];
  }

  getRouteParams() {
    this.subscription1 = this.activatedRoute.params.subscribe(routeParams => {
      // (routeParams.id);
      this.setSettingsForTable();
     
      this.columnsCopy = this.columns;
      this.parsePagination();
      this.routeParamsStatus = routeParams.status;
      this.role = localStorage.getItem('role');
      this.generateStatusFields();

      this.setSettingsGrid(this.role);
      this.getClaimsData(this.routeParamsStatus);
    });
  }

  ngAfterViewInit(): void {

  }

  toggle(name: string): void {
    this.checked.has(name) ? this.checked.delete(name) : this.checked.add(name);
    this.columns = this.columnsCopy.filter((column) => this.checked.has(column.key));
  }

  eventEmitted($event: { event: string; value: any }): void {
    switch($event.event) {
      case 'onClick':
        this.transferService.cOPClaimID.next($event.value.row.id);
        this.router.navigate(['cop', 'cabinet', 'single-claim']);
        break;
      case 'onPagination':
        break;
    }
  }

  parsePagination(): void {
    let onOrder = localStorage.getItem('onOrder');
    if(onOrder) {
      let parsedOnOrder = JSON.parse(onOrder);
      this.pagination.sort = parsedOnOrder.key ? parsedOnOrder.key : this.pagination.sort;
      this.pagination.order = parsedOnOrder.order ? parsedOnOrder.order : this.pagination.order;
    }
    // this.pagination.limit = obj.value.limit ? obj.value.limit : this.pagination.limit;
    // this.pagination.offset = obj.value.page ? obj.value.page : this.pagination.offset;
    // this.pagination.sort = !!obj.value.key ? obj.value.key : this.pagination.sort;
    // this.pagination.order = !!obj.value.order ? obj.value.order : this.pagination.order;
    // this.pagination = { ...this.pagination };
    // const pagination = `_limit=${this.pagination.limit}&_page=${this.pagination.offset}`;
    // const sort = `&_sort=${this.pagination.sort}&_order=${this.pagination.order}`;
    
  }

  setSettingsForTable() {
    this.configuration = { ...DefaultConfig };
    this.configuration.columnReorder = true;
    this.configuration.orderEnabled = true;
    this.configuration.threeWaySort = true;
    this.configuration.selectRow = true;
    this.configuration.searchEnabled = true;
    this.configuration.persistState = true;
    this.configuration.resizeColumn = true;
    this.configuration.fixedColumnWidth = false;
    this.configuration.tableLayout.striped = true;
    this.configuration.tableLayout.style = 'tiny';
    // this.configuration.isLoading = true;
  }

  refresh_claim(){
    this.loadingRefresh = true;
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
              title: this.translate.instant('chbo_my_claims_component.text16'),
              type: 'string',
            },
            pan: {
              title: this.translate.instant('chbo_my_claims_component.text17'),
              type: 'string',
            },
            trans_date: {
              title: this.translate.instant('chbo_my_claims_component.text18'),
              sort: true,
              sortDirection: 'desc',
              valuePrepareFunction: (trans_date) => {
                if(trans_date)
                  return this.datePipe.transform(new Date(trans_date), 'dd-MM-yyyy hh:mm:ss');
                else
                  return '';
              }
            },      
            merch_name_ips: {
              title: this.translate.instant('chbo_my_claims_component.text19'),
              type: 'string',
            },
            term_id: {
              title: this.translate.instant('chbo_my_claims_component.text20'),
              type: 'string',
            },
            trans_amount: {
              title: this.translate.instant('chbo_my_claims_component.text21'),
              type: 'number',
            },
            trans_currency: {
              title: this.translate.instant('chbo_my_claims_component.text22'),
              type: 'string',
            },
            auth_code: {
              title: this.translate.instant('chbo_my_claims_component.text23'),
              type: 'number',
            },
            claim_reason_code: {
              title: this.translate.instant('chbo_my_claims_component.text24'),
              type: 'number',
            },
            status: {
              title: this.translate.instant('chbo_my_claims_component.text25'),
              type: 'string',
            },
            action_needed: {
              title: this.translate.instant('chbo_my_claims_component.text26'),
              type: 'string',
            },
            result: {
              title: this.translate.instant('chbo_my_claims_component.text27'),
              type: 'string',
            },
            due_date: {
              title: this.translate.instant('chbo_my_claims_component.text28'),
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
    this.configuration.isLoading = true;
    this.claimsData = new Array<ClaimView>();
    this.dataTable = new Array();
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
        this.dataTable = this.claimsData;
        
        self.source = new LocalDataSource();
        //self.source.setPaging(1, 5);
        self.source.load(self.claimsData);
        //self.source .refresh();
      },
      error: error => {
        this.loadingRefresh = false;
        this.errorService.handleError(error);
        console.error('There was an error!', error);
      },
      complete: () => {
        this.loadingRefresh = false;
        this.configuration.isLoading = false;
        this.isUiLoad = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.claimsSubscription.unsubscribe();
    this.subscription1.unsubscribe();
    this.translationChangeSubscription.unsubscribe();
  }

  generateStatusFields() {
    this.fieldsStatus = new FieldsStatus();
    this.fieldsStatus.setStatusByRole(this.role);
  }

  public createReport(){
    if(this.claimsData){
      this.loadingReport = true;
      let str = '';
      str += this.translate.instant('chbo_my_claims_component.text16') + ';';
      str += this.translate.instant('chbo_my_claims_component.text17') + ';';
      str += this.translate.instant('chbo_my_claims_component.text18') + ';';
      str += this.translate.instant('chbo_my_claims_component.text19') + ';';
      str += this.translate.instant('chbo_my_claims_component.text20') + ';';
      str += this.translate.instant('chbo_my_claims_component.text21') + ';';
      str += this.translate.instant('chbo_my_claims_component.text22') + ';';
      str += this.translate.instant('chbo_my_claims_component.text23') + ';';
      str += this.translate.instant('chbo_my_claims_component.text24') + ';';
      str += this.translate.instant('chbo_my_claims_component.text25') + ';';
      str += this.translate.instant('chbo_my_claims_component.text26') + ';';
      str += this.translate.instant('chbo_my_claims_component.text27') + ';';
      str += this.translate.instant('chbo_my_claims_component.text28') + ';';
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
      this.loadingReport = false;
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
