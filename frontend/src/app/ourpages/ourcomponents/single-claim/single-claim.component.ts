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

  public radioGroupQueryValue1: number = 0; 
  public radioGroupQueryValue2: number = 0; 
  public radioGroupQueryValue3: number = 0; 
  public radioGroupQueryValue5: number = 0; 
  public radioGroupQueryValue6: number = 0; 
  public radioGroupQueryValue7: number = 0; 
  public radioGroupQueryValue8: number = 0; 
  public radioGroupQueryValue10: number = 0; 
  public radioGroupQueryValue11: number = 0; 
  public radioGroupQueryValue13: number = 0; 
  public radioGroupQueryValue15: number = 0; 

  role: string;
  isLastStep: boolean = false;
  merchantsArr: Array<any> = new Array<any>();

  fieldsStatus: FieldsStatus;
  editedAnswers: Array<any> = new Array<any>();
  valNo = {val: 1, text: 'ні'};
  valYes = {val: 2, text: 'так'};
  valYes2 = {val: 2, text: 'так, але вважаю, що це шахрайство'};
  valYes3 = {val: 3, text: "так, але я не пам'ятаю транзакцію"};
  valWhereCard = {val: 1, text: 'картка в моєму володінні'};
  valWhereCard2 = {val: 2, text: 'картка була загублена або вкрадена'};
  valNeedDocument = {val: 1, text: 'так'};
  valNeedDocument2 = {val: 2, text: 'ні, я хочу подати заявку на повернення коштів'};
  valOperation = {val: 1, text: 'так'};
  valOperation2 = {val: 2, text: 'ні, це була оплата товарів або послуг'};
  valMoney = {val: 1, text: 'ні, це була інша операція в цьому банкоматі'};
  valMoney2 = {val: 2, text: 'так'};
  valOll = {val: 1, text: 'частково'};
  valOll2 = {val: 2, text: 'в повному обсязі'};
  valWhereOperation = {val: 1, text: 'так'};
  valWhereOperation2 = {val: 2, text: 'ні'};
  valGet = {val: 1, text: 'ні'};
  valGet2 = {val: 2, text: 'так'};
  valPay = {val: 1, text: 'готівкою'};
  valPay2 = {val: 2, text: 'іншою картою'};
  valBack = {val: 1, text: 'так'};
  valBack2 = {val: 2, text: 'ні'};

  ngOnInit(): void {
    //console.log('ngOnInit');
    
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
    this.loadMerchants();

    this.getListMerchant();
    this.getListCurrency();
    this.getListQuestions();

    //console.log('ngOnInit--------END');
  }

  ngOnDestroy(): void {
    this.transferService.cOPClaimID.next('');
    this.getClaimSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.part = 'one';
    this.cdr.detectChanges();
  }

  lastStep(code:string) {
    this.claimData.claim_reson_code = code;
    this.isLastStep = true;
    this.claimData.answers = {};
    for(let i = 0; i < this.editedAnswers.length; i++) {
      this.claimData.answers[Object.keys(this.editedAnswers[i])[0]] = this.editedAnswers[i][Object.keys(this.editedAnswers[i])[0]];
    }
    this.saveClaim();
    console.log(this.claimData.answers);
  }

  saveClaim() {
    console.log(this.claimData);
    this.httpService.createNewClaim(this.claimData).subscribe({
      next: (response: any) => {
        console.log('ok');
        console.log(response); 
        
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
       
      }
    });
  }

  change(par: any) {
    console.log(par);
    switch(par.part) {
      case 'one':
        this.editedAnswers.push({"1": par.formGroups.value.groupQuery1.val == 1? false:true});
        if(par.formGroups.value.groupQuery1.val == 1) {
          this.part = 'two';
        } else {
          this.part = 'five';
        }
        break;
      case 'two':
        this.editedAnswers.push({"2": par.formGroups.value.groupQuery2.text});
        if(par.formGroups.value.groupQuery2.val == 3) {
          this.part = 'five';
        } else {
          this.part = 'three';
        }
        break;
      case 'three':
        this.editedAnswers.push({"3": par.formGroups.value.groupQuery3.text});
          if(par.formGroups.value.groupQuery3.val == 3) {
            this.lastStep('0021');
          } else {
            this.part = 'four';
          }
          break;
      case 'four':
        this.editedAnswers.push({"4": par.formGroups.value.groupQuery4});
        this.lastStep('0021');
          break;
      case 'five':
        this.editedAnswers.push({"5": par.formGroups.value.groupQuery5.text});
        if(par.formGroups.value.groupQuery5.val == 1) {
          this.lastStep('0100');
        } else {
          this.part = 'six';
        }
        break;
      case 'six':
        this.editedAnswers.push({"6": par.formGroups.value.groupQuery6.text});
        if(par.formGroups.value.groupQuery6.val == 1) {
          this.part = 'seven';
        } else {
          this.part = 'ten';
        }
        break;
      case 'seven':
        this.editedAnswers.push({"7": par.formGroups.value.groupQuery7.text});
        if(par.formGroups.value.groupQuery7.val == 1) {
          this.lastStep('0500');
        } else {
          this.part = 'eight';
        }
        break;
      case 'eight':
        this.editedAnswers.push({"8": par.formGroups.value.groupQuery8.text});
        if(par.formGroups.value.groupQuery8.val == 1) {
          this.part = 'nine';
        } else {
          this.lastStep('0001');      
        }
        break;
      case 'nine':
        this.editedAnswers.push({"9": par.formGroups.value.groupQuery9});
        this.lastStep('0001');
        break;
      case 'ten':
        this.editedAnswers.push({"10": par.formGroups.value.groupQuery10.val == 1? true:false});
        this.part = 'eleven';
        break;
      case 'eleven':
        this.editedAnswers.push({"11": par.formGroups.value.groupQuery11.val == 1? false:true});
        if(par.formGroups.value.groupQuery11.val == 1) {
          this.lastStep('0009');
        } else {
          this.part = 'twelve';
        }
        break;
      case 'twelve':
        this.editedAnswers.push({"12": par.formGroups.value.groupQuery12.caption});
        if(par.formGroups.value.groupQuery12.id == 1) {
          this.lastStep('0011');
        } else if(par.formGroups.value.groupQuery12.id == 2) {
          this.part = 'thirteen';
        } else if(par.formGroups.value.groupQuery12.id == 3) {
          this.part = 'fourteen';
        } else if(par.formGroups.value.groupQuery12.id == 4) {
          this.lastStep('0003');
        } else if(par.formGroups.value.groupQuery12.id == 5) {
          this.part = 'thirteen';
        } else if(par.formGroups.value.groupQuery12.id == 6) {
          this.part = 'sixteen';
        } else if(par.formGroups.value.groupQuery12.id == 7) {
          this.lastStep('0500');
        } else {
          console.log('stop');
        }
        break;
        case 'thirteen':
          this.editedAnswers.push({"13": par.formGroups.value.groupQuery13.text});
          this.lastStep('0027');
        break;
        case 'fourteen':
          this.editedAnswers.push({"14": this.claimData.trans_date});
          this.lastStep('0004');
        break;
        case 'fiveteen':
          this.editedAnswers.push({"15": par.formGroups.value.groupQuery15.val == 1? true:false});
          this.lastStep('0009');
        break;
        case 'sixteen':
          this.editedAnswers.push({"16": par.formGroups.value.groupQuery16});
          this.lastStep('0012');
        break;
    }
    console.log(this.editedAnswers);
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

  loadMerchants() {
    console.log('loadMerchants');
    this.httpService.getMerchants().subscribe({
        next: (response: any) => {
          
          console.log(response); 
          this.merchantsArr = response.results;
        },
        error: error => {
          console.error('There was an error!', error);
        },
        complete: () => {
         
        }
      });
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
    // if(this.claimData && this.claimData.trans_date){
    //   return this.datePipe.transform(new Date(this.claimData.trans_date), 'dd-MM-yyyy hh:mm:ss');
    // } else {
    //   return '';
    // }
    return "";
  }

  testData(){
    this.claimData = new ClaimView();

    // this.claimData.fio = "Taras Shevchenko";
    // this.claimData.cOPClaimID = 1111;
    // this.claimData.pAN = 1234123412341234;
    // this.claimData.transDate = new Date();
    // this.claimData.merchantID = 1;
    // this.claimData.merchantName = 'Rukavichka 1';
    // this.claimData.terminalID = 12345678;
    // this.claimData.amount = 1000.01;
    // this.claimData.currency = 1;
    // this.claimData.currencyName = 'грн';
    // this.claimData.authCode = 123456;
    // this.claimData.reasonCodeGroup = 1110001111000;
    // this.claimData.stage = 'stage';
    // this.claimData.actionNeeded = 'action Needed';
    // this.claimData.result = 'result';
    // this.claimData.dueDate = new Date();
    // console.log(this.claimData);

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
    console.log(this.claimData);
    
    //this.transferService.pAD.next(this.claimData.pan.toString());
    //this.router.navigate(['ourpages', 'ourcomponents', 'claims']);
  }

  onClickBack(){
    this.isLastStep = false;
    this.editedAnswers = new Array<any>();
    this.stepNewRecord = 1;
  }

  getListMerchant(){
    this.listMerchant = new Array<SelectorData>();
    this.listMerchant.push({id:1, caption:"Rukavichka 1"});
    this.listMerchant.push({id:2, caption:"Rukavichka 2"});
  }

  getListCurrency(){
    this.listCurrency = new Array<SelectorData>();
    this.listCurrency.push({id:1, caption:"hrn"});
    this.listCurrency.push({id:2, caption:"usd"});
    this.listCurrency.push({id:2, caption:"eur"});
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

// export class AnswersModel {
//   constructor(props?: Partial<FieldsStatus>) {
//     if (props) {
//         this.'1' = props.'1' || '';
//         this.transDate = props.transDate || new paramStatusFields();
//         this.merchantID = props.pan || new paramStatusFields();
//         this.terminalID = props.terminalID || new paramStatusFields();
//         this.amount = props.amount || new paramStatusFields();
//         this.currency = props.currency || new paramStatusFields();
//         this.authCode = props.authCode || new paramStatusFields();
//         this.comment = props.comment || new paramStatusFields();
//         this.cOPClaimID = props.cOPClaimID || new paramStatusFields();
//         this.merchantName = props.merchantName || new paramStatusFields();
//         this.reasonCodeGroup = props.reasonCodeGroup || new paramStatusFields();
//         this.stage = props.stage || new paramStatusFields();
//         this.actionNeeded = props.actionNeeded || new paramStatusFields();
//         this.result = props.result || new paramStatusFields();
//         this.dueDate = props.dueDate || new paramStatusFields();
//         this.currencyName = props.currencyName || new paramStatusFields();
//         this.fio = props.fio || new paramStatusFields();
//         this.rC = props.rC || new paramStatusFields();
//         this.aRN = props.aRN || new paramStatusFields();
//         this.docs =  props.docs || new paramStatusFields();

//     } else {
//         this.default();
//     }
// }

// one
// two
// three
// four
// five
// six
// seven
// eight
// nine
// ten
// eleven
// twelve
// thirteen
// fourteen
// fiveteen
// sixteen;

//   default() {
//       this.'1' = '';
//   }
// }