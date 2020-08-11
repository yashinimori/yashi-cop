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
  selector: 'ngx-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss']
})
export class ClaimsComponent implements OnInit, OnDestroy {
  claimsData: Array<ClaimView>;

  settings = {
    hideSubHeader: true,
    actions:{
    // add: {
    //   addButtonContent: '<i class="nb-plus"></i>',
    //   createButtonContent: '<i class="nb-checkmark"></i>',
    //   cancelButtonContent: '<i class="nb-close"></i>',
    // },
    // edit: {
    //   editButtonContent: '<i class="nb-edit"></i>',
    //   saveButtonContent: '<i class="nb-checkmark"></i>',
    //   cancelButtonContent: '<i class="nb-close"></i>',
    // },
    // delete: {
    //   deleteButtonContent: '<i class="nb-trash"></i>',
    //   confirmDelete: true,
    // },
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      cOPClaimID: {
        title: 'COP Claim ID',
        type: 'number',
      },
      pAN: {
        title: 'Номер карти',
        type: 'string',
      },
      transDate: {
        title: 'Дата транзакції',
        valuePrepareFunction: (transDate) => {
          return this.datePipe.transform(new Date(transDate), 'dd-MM-yyyy hh:mm:ss');
        }
      },      
      merchantName: {
        title: "Назва торговця",
        type: 'string',
      },
      terminalID: {
        title: "Ім'я терміналу",
        type: 'string',
      },
      amount: {
        title: "Cума",
        type: 'number',
      },
      currencyName: {
        title: "Валюта",
        type: 'string',
      },
      authCode: {
        title: "Код авторизації",
        type: 'number',
      },
      reasonCodeGroup: {
        title: "Reason Code Group",
        type: 'number',
      },
      stage: {
        title: "Статус",
        type: 'string',
      },
      actionNeeded: {
        title: "Індикатор",
        type: 'string',
      },
      result: {
        title: "Результат",
        type: 'string',
      },
      dueDate: {
        title: 'Кінцевий термін претензії.',
        valuePrepareFunction: (dueDate) => {
          return this.datePipe.transform(new Date(dueDate), 'dd-MM-yyyy');
        }
      },

    },
  };

  //source: LocalDataSource = new LocalDataSource();

  // constructor(private service: SmartTableData) {
  //   const data = this.service.getData();
  //   this.source.load(data);
  // }

  source: LocalDataSource;

  constructor(private datePipe: DatePipe, 
    private transferService: TransferService,
    private router: Router,
    private httpServise: HttpService) {
    this.claimsData = new Array<ClaimView>();
  }


  claimsSubscription: Subscription = new Subscription();

  testData(){
    let t = new ClaimView();
    
    t.cOPClaimID = 1111;
    t.pAN = 1234123412341234;
    t.transDate = new Date();
    t.merchantName = 'Rukavichka 1';
    t.terminalID = 12345678;
    t.amount = 1000.01;
    t.currencyName = 'грн';
    t.authCode = 123456;
    t.reasonCodeGroup = 1110001111000;
    t.stage = 'stage';
    t.actionNeeded = 'action Needed';
    t.result = 'result';
    t.dueDate = new Date();

    this.claimsData = new Array<ClaimView>();
    this.claimsData.push(t);

  }


  getClaimsData(): void{
    this.testData();
    this.source = new LocalDataSource(this.claimsData);
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onUserRowSelect(event): void {
    this.transferService.cOPClaimID.next(event.cOPClaimID);
    this.router.navigate(['ourpages', 'ourcomponents', 'single-claim']);
    console.log(event);
  }

  ngOnInit(): void {
    this.getClaimsData();
    this.loadClaims();
  }

  loadClaims() {
    this.claimsSubscription = this.httpServise.getClaimList().subscribe({
      next: (response: any) => {
        console.log(response); 
               
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
  }
}
