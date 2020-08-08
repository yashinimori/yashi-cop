import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransferService } from '../../../share/services/transfer.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../share/services/http.service';
import { Subscription } from 'rxjs';
import { ClaimView } from '../../../share/models/claim-view.model';
import { DatePipe } from '@angular/common';
import { SelectorData } from '../../../share/models/selector-data.model';


@Component({
  selector: 'ngx-single-claim',
  templateUrl: './single-claim.component.html',
  styleUrls: ['./single-claim.component.scss']
})
export class SingleClaimComponent implements OnInit, OnDestroy {
  
  constructor(private datePipe: DatePipe, 
    private transferService: TransferService, 
    private httpService: HttpService,
    private router: Router) { }

    cOPClaimID: string;
    isNewRecord: boolean = true;
    getClaimSubscription: Subscription = new Subscription();
    claimData: ClaimView;
    listMerchant: Array<SelectorData>;
    listCurrency: Array<SelectorData>;

  ngOnInit(): void {
    this.claimData = new ClaimView();

    // this.cOPClaimID = this.transferService.cOPClaimID.getValue();

    // this.isNewRecord = this.cOPClaimID.length == 0 ? true : false;

    // if(!this.isNewRecord){
    //   this.getClaimsData();
    // }
    
    this.getClaimsData(); //test

    this.getListMerchant();
    this.getListCurrency();
  }

  ngOnDestroy(): void {
    this.transferService.cOPClaimID.next('');
    this.getClaimSubscription.unsubscribe();
  }

  
  getClaimsData(){
    this.testData();
  }

  public get getDateTrans(){
    if(this.claimData && this.claimData.transDate){
      return this.datePipe.transform(new Date(this.claimData.transDate), 'dd-MM-yyyy hh:mm:ss');
    } else {
      return '';
    }
  }

  testData(){
    this.claimData = new ClaimView();

    this.claimData.fio = "Taras Shevchenko";
    this.claimData.cOPClaimID = 1111;
    this.claimData.pAN = 1234123412341234;
    this.claimData.transDate = new Date();
    this.claimData.merchantID = 1;
    this.claimData.merchantName = 'Rukavichka 1';
    this.claimData.terminalID = 12345678;
    this.claimData.amount = 1000.01;
    this.claimData.currency = 1;
    this.claimData.currencyName = 'грн';
    this.claimData.authCode = 123456;
    this.claimData.reasonCodeGroup = 1110001111000;
    this.claimData.stage = 'stage';
    this.claimData.actionNeeded = 'action Needed';
    this.claimData.result = 'result';
    this.claimData.dueDate = new Date();
    console.log(this.claimData);

  }

  onClickFirstStep(){
    console.log(this.claimData);

  }

  getListMerchant(){
    this.listMerchant = new Array<SelectorData>();
    this.listMerchant.push({id:1, caption:"Rukavichka 1"});
    this.listMerchant.push({id:2, caption:"Rukavichka 2"});
  }

  getListCurrency(){
    this.listCurrency = new Array<SelectorData>();
    this.listCurrency.push({id:1, caption:"грн"});
    this.listCurrency.push({id:2, caption:"долар"});
    this.listCurrency.push({id:2, caption:"євро"});
  }

}
