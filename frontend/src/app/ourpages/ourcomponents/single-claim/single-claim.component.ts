import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransferService } from '../../../share/services/transfer.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../share/services/http.service';
import { Subscription } from 'rxjs';
import { ClaimView } from '../../../share/models/claim-view.model';
import { DatePipe } from '@angular/common';
import { SelectorData } from '../../../share/models/selector-data.model';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { FieldsStatus } from '../../../share/models/fieldsStatus.model';

@Component({
  selector: 'ngx-single-claim',
  templateUrl: './single-claim.component.html',
  styleUrls: ['./single-claim.component.scss']
})
export class SingleClaimComponent implements OnInit, OnDestroy {
  
  constructor(public fb: FormBuilder,
    private datePipe: DatePipe, 
    private transferService: TransferService, 
    private httpService: HttpService,
    private router: Router) { }

  cOPClaimID: string;
  isNewRecord: boolean = true;
  getClaimSubscription: Subscription = new Subscription();
  claimData: ClaimView;
  listMerchant: Array<SelectorData>;
  listCurrency: Array<SelectorData>;
  stepNewRecord: number;
  
  exampleForm: any;
  formRadioGroups: any;
  radioGroupQuery1: any; 
  radioGroupQuery2: any; 
  radioGroupQuery3: any;

  public radioGroupQueryValue1: number; 
  public radioGroupQueryValue2: number; 
  public radioGroupQueryValue3: number; 

  role: string;

  fieldsStatus: FieldsStatus;

  // groupValue1;
  // groupValue2;

  ngOnInit(): void {
    console.log('ngOnInit');
    // this.exampleForm = new FormGroup({
    //   group1: new FormControl(),
    //   group2: new FormControl()
    // });

    this.role = localStorage.getItem('role');

    this.generateStatusFields();


    this.formRadioGroups = new FormGroup({
      radioGroupQuery1: new FormControl(),
      radioGroupQuery2: new FormControl(),
      radioGroupQuery3: new FormControl()
    });

    this.claimData = new ClaimView();
    this.stepNewRecord = 1;

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

  generateStatusFields() {

    if(this.role == 'user') {
      this.fieldsStatus = new FieldsStatus();
      console.log(this.fieldsStatus);
    }
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

  onClickGoNextStep(){
    console.log(this.claimData);
    this.stepNewRecord = 2;

    this.radioGroupQueryValue1 = 1;
    this.radioGroupQueryValue2 = 1;
    this.radioGroupQueryValue3 = 2;

    console.log(this.radioGroupQueryValue1);
    console.log(this.radioGroupQueryValue2);
    console.log(this.radioGroupQueryValue3);

    console.log('onClickGoNextStep');
  }

  onClickSend(){
    //console.log(this.claimData);

    console.log(this.radioGroupQueryValue1);
    console.log(this.radioGroupQueryValue2);
    console.log(this.radioGroupQueryValue3);
    
  }

  onClickBack(){
    this.stepNewRecord = 1;
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
