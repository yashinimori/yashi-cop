import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { TransferService } from '../../../share/services/transfer.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../share/services/http.service';
import { Subscription } from 'rxjs';
import { ClaimView } from '../../../share/models/claim-view.model';
import { DatePipe } from '@angular/common';
import { SelectorData } from '../../../share/models/selector-data.model';
import { FormGroup, FormControl } from '@angular/forms';
import { FieldsStatus } from '../../../share/models/fieldsStatus.model';

@Component({
  selector: 'ngx-single-claim',
  templateUrl: './single-claim.component.html',
  styleUrls: ['./single-claim.component.scss']
})
export class SingleClaimComponent implements OnInit, OnDestroy, AfterViewInit {
  
  constructor(private datePipe: DatePipe, 
    private transferService: TransferService, 
    private httpService: HttpService,
    private router: Router,
    private cdr: ChangeDetectorRef) { }

  @ViewChild('one') one:TemplateRef<any>;
  @ViewChild('two') two:TemplateRef<any>;
  @ViewChild('three') three:TemplateRef<any>;
  @ViewChild('four') four:TemplateRef<any>;
  @ViewChild('five') five:TemplateRef<any>;
  @ViewChild('six') six:TemplateRef<any>;
  @ViewChild('seven') seven:TemplateRef<any>;
  @ViewChild('eight') eight:TemplateRef<any>;
  @ViewChild('nine') nine:TemplateRef<any>;
  @ViewChild('ten') ten:TemplateRef<any>;
  @ViewChild('eleven') eleven:TemplateRef<any>;
  @ViewChild('twelve') twelve:TemplateRef<any>;
  @ViewChild('thirteen') thirteen:TemplateRef<any>;
  @ViewChild('fourteen') fourteen:TemplateRef<any>;
  @ViewChild('fiveteen') fiveteen:TemplateRef<any>;
  @ViewChild('sixteen') sixteen:TemplateRef<any>;

  part = 'one';

  

  cOPClaimID: string;
  isNewRecord: boolean = true;
  getClaimSubscription: Subscription = new Subscription();
  claimData: ClaimView;
  listMerchant: Array<SelectorData>;
  listCurrency: Array<SelectorData>;
  listQuestions: Array<SelectorData>;
  stepNewRecord: number;
  question: number;
  exampleForm: any;
  formGroups: any;
  groupQuery1: any; 
  groupQuery2: any; 
  groupQuery3: any;
  groupQuery4: any;
  groupQuery5: any;
  groupQuery6: any;
  groupQuery7: any;
  groupQuery8: any;
  groupQuery9: any;
  groupQuery10: any;
  groupQuery11: any;
  groupQuery12: any;
  groupQuery13: any;
  groupQuery14: any;  
  groupQuery15: any;
  groupQuery16: any;


  public radioGroupQueryValue1: number; 
  public radioGroupQueryValue2: number; 
  public radioGroupQueryValue3: number; 

  role: string;

  fieldsStatus: FieldsStatus;

  
  ngOnInit(): void {
    console.log('ngOnInit');
    
    this.role = localStorage.getItem('role');
    this.role = 'user';
    this.generateStatusFields();

    this.formGroups = new FormGroup({
      
      groupQuery1: new FormControl(), 
      groupQuery2: new FormControl(), 
      groupQuery3: new FormControl(),
      groupQuery4: new FormControl(),
      groupQuery5: new FormControl(),
      groupQuery6: new FormControl(),
      groupQuery7: new FormControl(),
      groupQuery8: new FormControl(),
      groupQuery9: new FormControl(),
      groupQuery10: new FormControl(),
      groupQuery11: new FormControl(),
      groupQuery12: new FormControl(),
      groupQuery13: new FormControl(),
      groupQuery14: new FormControl(),  
      groupQuery15: new FormControl(),
      groupQuery16: new FormControl(),


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
    this.getListQuestions();

    console.log('ngOnInit--------END');
  }

  ngOnDestroy(): void {
    this.transferService.cOPClaimID.next('');
    this.getClaimSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.part = 'one';
    this.cdr.detectChanges();
  }

  change(par: any) {
    console.log(par);
    switch(par.part) {
      case 'one':
        console.log(par.formGroups.value.groupQuery1);
        if(par.formGroups.value.groupQuery1 == 1) {
          this.part = 'two';
        } else {
          this.part = 'five';
        }
        break;
      case 'two':
        if(par.formGroups.value.groupQuery2 == 3) {
          this.part = 'five';
        } else {
          this.part = 'three';
        }
        break;
      case 'three':
          if(par.formGroups.value.groupQuery3 == 3) {
            console.log('0021');
          } else {
            this.part = 'four';
          }
          break;
      case 'four':
          console.log('0021');
          break;
      case 'five':
        if(par.formGroups.value.groupQuery5 == 1) {
          console.log('0100');
        } else {
          this.part = 'six';
        }
        break;
      case 'six':
        if(par.formGroups.value.groupQuery6 == 1) {
          this.part = 'seven';
        } else {
          this.part = 'ten';
        }
        break;
      case 'seven':
        if(par.formGroups.value.groupQuery7 == 1) {
          console.log('0500');
        } else {
          this.part = 'eight';
        }
        break;
      case 'eight':
        if(par.formGroups.value.groupQuery8 == 1) {
          this.part = 'nine';
        } else {
          console.log('0001');          
        }
        break;
      case 'nine':
        console.log('0001');
        break;
      case 'ten':
        this.part = 'eleven';
        break;
      case 'eleven':
        if(par.formGroups.value.groupQuery11 == 1) {
          console.log('0009');
        } else {
          this.part = 'twelve';
        }
        break;
      case 'twelve':
        if(par.formGroups.value.groupQuery12 == 1) {
          console.log('0011');
        } else {
          console.log('stop');
        }
        break;
    }
    // if(par.part == 'one') {
    //   console.log(par.formGroups.value.groupQuery1);
    //   if(par.formGroups.value.groupQuery1 == 1) {
    //     this.part = 'two';
    //   } else {
    //     this.part = 'five';
    //   }
    // }
    

    //this.part = par.part == 'two'? 'one':'two';
  }

  generateStatusFields() {
    this.fieldsStatus = new FieldsStatus();
    this.fieldsStatus.setStatusByRole(this.role);
    console.log(this.fieldsStatus);
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
    this.part = 'one';
    this.stepNewRecord = 2;
    this.cdr.detectChanges();


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
    
    this.transferService.pAD.next(this.claimData.pAN.toString());
    this.router.navigate(['ourpages', 'ourcomponents', 'claims']);
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

  getListQuestions(){
    this.listQuestions = new Array<SelectorData>();
    this.listQuestions.push({id:1, caption:"Дублювання транзакцій"});
    this.listQuestions.push({id:2, caption:"Оплату проведено іншим способом"});
    this.listQuestions.push({id:3, caption:"Товар або послугу повернено, але немає повернення коштів"});
    this.listQuestions.push({id:4, caption:"Підписка була скасована, але суму було списано"});
    this.listQuestions.push({id:5, caption:"Отримані товари були пошкоджені, або не такі, як було описано в замовлені"});
    this.listQuestions.push({id:6, caption:"Неправильна сума або валюта транзакція"});
    this.listQuestions.push({id:7, caption:"інша причина"});
  }

}
