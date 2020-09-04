import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { TransferService } from '../../../share/services/transfer.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../share/services/http.service';
import { Subscription } from 'rxjs';
import { ClaimView } from '../../../share/models/claim-view.model';
import { DatePipe } from '@angular/common';
import { SelectorData } from '../../../share/models/selector-data.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FieldsStatus } from '../../../share/models/fieldsStatus.model';
import { SingleClaimFormsTransfer } from '../../../share/models/single-claim-forms-transfer.model';
import { ClaimComment } from '../../../share/models/claim-comment.model';
import { ClaimDocument } from '../../../share/models/claim-document.model';
import { runInThisContext } from 'vm';
import { TimelineView } from '../../../share/models/timeline-view.model'
import { MerchUser } from '../../../share/models/merch-user.model';

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
    private cdr: ChangeDetectorRef) { 

      this.claimData = new ClaimView();
    }

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
  @ViewChild('seventeen') seventeen:TemplateRef<any>;

  filesArr: Array<any> = new Array<any>();
  selectedFile: any;
  
  filesLogArr: Array<any> = new Array<any>();
  selectedFileLog: any;

  part = 'one';

  cOPClaimID: string;
  isNewRecord: boolean = true;
  isUIloaded: boolean = false;
  getClaimSubscription: Subscription = new Subscription();
  claimData: ClaimView;
  Timeline: TimelineView;
  //listMerchant: Array<SelectorData>;
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
  groupQuery17: any;

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
  merchantsArr: Array<MerchUser> = new Array<MerchUser>();
  claimId: any;
  userId: any;

  fieldsStatus: FieldsStatus;
  editedAnswers: Array<any> = new Array<any>();
  valNo = {val: 1, text: 'Ні'};
  valYes = {val: 2, text: 'Так'};
  valYes2 = {val: 2, text: 'Так, але вважаю, що це шахрайство'};
  valYes3 = {val: 3, text: "Так, але я не пам'ятаю транзакцію"};
  valWhereCard = {val: 1, text: 'Картка в моєму володінні'};
  valWhereCard2 = {val: 2, text: 'Картка була загублена або вкрадена'};
  valNeedDocument = {val: 1, text: 'Так'};
  valNeedDocument2 = {val: 2, text: 'Ні, я хочу подати заявку на повернення коштів'};
  valOperation = {val: 1, text: 'Так'};
  valOperation2 = {val: 2, text: 'Ні, це була оплата товарів або послуг'};
  valMoney = {val: 1, text: 'Ні, це була інша операція в цьому банкоматі'};
  valMoney2 = {val: 2, text: 'Так'};
  valOll = {val: 1, text: 'Частково'};
  valOll2 = {val: 2, text: 'В повному обсязі'};
  valWhereOperation = {val: 1, text: 'Так'};
  valWhereOperation2 = {val: 2, text: 'Ні'};
  valGet = {val: 1, text: 'Ні'};
  valGet2 = {val: 2, text: 'Так'};
  valPay = {val: 1, text: 'Готівкою'};
  valPay2 = {val: 2, text: 'Іншою картою'};
  valBack = {val: 1, text: 'Так'};
  valBack2 = {val: 2, text: 'Ні'};
  
  comments: Array<ClaimComment>;
  documents: Array<ClaimDocument>;
  
  chargeback_date: Date;
  second_presentment_date: Date;
  pre_arbitration_date: Date;
  pre_arbitration_response_date: Date;
  arbitration_date: Date;
  arbitration_response_date : Date;

  ngOnInit(): void {
    this.claimData = new ClaimView();
    this.Timeline = new TimelineView();
    this.claimData.user = {};

    this.role = localStorage.getItem('role');
    this.claimId = this.transferService.cOPClaimID.getValue();

    if (this.claimId.length != 0) {
      this.loadClaim();
      this.timeline();
    }
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
      groupQuery17: new FormControl(),

    });
    
    this.stepNewRecord = 1;

    //this.claimId = this.transferService.cOPClaimID.getValue();
   

    this.isNewRecord = this.claimId.length == 0 ? true : false;

    // if(!this.isNewRecord){
    //   this.loadClaim();
    // } else {
    //   this.getListMerchant();
    //   this.getListCurrency();
    //   this.getListQuestions();
    // }
 
    this.getListMerchant();
    this.getListCurrency();
    this.getListQuestions();

    this.getDates();

    //this.loadClaimDocumsnts();
    
  }

  ngOnDestroy(): void {
    this.transferService.cOPClaimID.next('');
    this.getClaimSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.part = 'one';
    this.cdr.detectChanges();
  }

  timeline(){
    this.httpService.getTimeLine(this.claimId).subscribe({
        next: (response: any) => {
          this.Timeline = response;
        },
        error: error => {
          console.error('There was an error!', error);
        },
        complete: () => {
         
        }
      });
  }

  loadClaim() {
    this.httpService.getSingleClaim(this.claimId).subscribe({
        next: (response: any) => {
          this.claimData = response;
          this.setClaimComments();
          this.setClaimDocumsnts();

        },
        error: error => {
          console.error('There was an error!', error);
        },
        complete: () => {
          this.isUIloaded = true;
        }
      });
  }
  

  setClaimComments(){
    this.comments = new Array<ClaimComment>();
    let c = this.claimData['comments'];
    if(c){
      c.forEach(el => {
        let item = new ClaimComment();
        item.text = el.text;
        if(el.create_date)
          item.create_date_str = this.datePipe.transform(new Date(el.create_date), 'dd/MM/yyyy');
        else
          item.create_date_str = '';

        item.user = el.user.first_name + ' ' + el.user.last_name;

        this.comments.push(item);
      });
    }
  }


  setClaimDocumsnts(){

    this.documents = new Array<ClaimDocument>();
    let d = this.claimData['documents'];
    if(d){
      d.forEach(el => {
        let item = new ClaimDocument();
        item.description = el['description'];
        item.file = el['file'];       
        if(item.file)
          item.file_name = item.file.split('\\').pop().split('/').pop();
        else
        item.file_name = 'Документ';

        this.documents.push(item);
      });

    }
  }


  loadClaimDocumsnts(){
    this.httpService.getClaimDocs(this.claimId).subscribe({
      next: (response: any) => {
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
       
      }
    });
  }



  lastStep(code:string) {
    this.claimData.claim_reason_code = code;
    this.claimData.comment = this.claimData.ch_comments;
    this.claimData.ch_comments = [{'text': this.claimData.ch_comments}];
    this.isLastStep = true;
    this.claimData.answers = {};
    for(let i = 0; i < this.editedAnswers.length; i++) {
      this.claimData.answers[Object.keys(this.editedAnswers[i])[0]] = this.editedAnswers[i][Object.keys(this.editedAnswers[i])[0]];
    }
    // this.saveClaim();
    // this.router.navigate(['ourpages', 'ourcomponents', 'claims'])
  }


  uploadDoc(claim: any) {
    if(this.filesArr && this.filesArr.length > 0){
      let data = this.filesArr[0];
      claim.form_name = "claim_form";

      this.httpService.uploadClaimDoc(data, "substitute_draft", claim.id, 
      claim.user.id, '').subscribe({
        next: (response: any) => {
          this.filesArr = [];
        },
        error: error => {
          console.error('There was an error!', error);
        },
        complete: () => {

        }
      });
    }
  }

  commentClaim(claimId: any, comment: any, form_name: any) {
    this.httpService.commentClaim(claimId, comment, form_name).subscribe({
      next: (response: any) => {
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {

      }
    });
  }  

  saveClaim() {
    //this.claimData.form_name = 'claim_form';
    
    //this.claimData.trans_date = new Date(this.claimData.trans_date) + new Date().getTimezoneOffset();

    let lt = (new Date().getTimezoneOffset() * -1 * 60000) + 2000;
    this.claimData.trans_date = new Date(this.claimData.trans_date.getTime() + lt);
    
    console.log('saveClaim');
    console.log(this.claimData);

    this.httpService.createNewClaim(this.claimData).subscribe({
      next: (response: any) => {
        this.uploadDoc(response);
        if(this.claimData.comment){
          this.commentClaim(response['id'], this.claimData.comment, '');
        }
        
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
        this.router.navigate(['ourpages', 'ourcomponents', 'claims']);
      }
    });
  }

  change(par: any) {
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
          if(par.formGroups.value.groupQuery3.val == 1) {
            this.lastStep('0500');
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
          this.part = 'seventeen';
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
        case 'seventeen':
          this.editedAnswers.push({"17": par.formGroups.value.groupQuery17});
          if(par.formGroups.value.groupQuery17.val == 1) {
            this.part = 'fiveteen';
          } else {
            this.lastStep('0009');
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
  
  generateStatusFields() {
    this.fieldsStatus = new FieldsStatus();
    this.fieldsStatus.setStatusByRole(this.role);
  }
  
  public get getDateTrans(){
    if(this.claimData && this.claimData.trans_date){
      return this.datePipe.transform(new Date(this.claimData.trans_date), 'dd-MM-yyyy hh:mm:ss');
    } else {
      return '';
    }
    
  }

  
  onClickGoNextStep(){
    this.part = 'one';
    this.stepNewRecord = 2;
    this.cdr.detectChanges();
  }

  onClickSend(){
    //this.transferService.pAD.next(this.claimData.pan.toString());
    //this.router.navigate(['ourpages', 'ourcomponents', 'claims']);
  }

  onClickBack(){
    this.isLastStep = false;
    this.editedAnswers = new Array<any>();
    this.stepNewRecord = 1;
  }

  getListMerchant(){
    this.merchantsArr = new Array<MerchUser>();

    this.httpService.getMerchantsAll().subscribe({
        next: (response: any) => {
          this.merchantsArr = response;
        },
        error: error => {
          console.error('There was an error!', error);
        },
        complete: () => {
         
        }
      });
  }

  getListCurrency(){
    this.listCurrency = new Array<SelectorData>();
    this.listCurrency.push({id:1, caption:"uah"});
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
    this.listQuestions.push({id:7, caption:"Інша причина"});
  }



  fileLogChanged(e) {
    this.selectedFileLog = e.target.files[0];
    if(this.selectedFileLog.size > 50000000) {
      alert('Файл занадто великий!');
    } else {
      this.filesLogArr.push(this.selectedFileLog);
    }
  }

  deleteAttachedFileLog(file:any) {
    this.filesLogArr.splice(this.filesLogArr.indexOf(this.filesLogArr.find(e=> e == file)), 1);
  }

  
  onClickEscalation(){
    let val = new SingleClaimFormsTransfer();
    val.claimId = this.claimId;  
    val.typeOperation = "NewEscalation";
    this.transferService.singleClaimFormsSettings.next(val);
  
    this.router.navigate(['ourpages', 'ourcomponents', 'single-claim-forms']);
  }

  onClickFinish(){
    let val = new SingleClaimFormsTransfer();
    val.claimId = this.claimId;  
    val.typeOperation = "FinishForm";
    this.transferService.singleClaimFormsSettings.next(val);
  
    this.router.navigate(['ourpages', 'ourcomponents', 'single-claim-forms']);
  }

  onClickClarifications(){
    let val = new SingleClaimFormsTransfer();
    val.claimId = this.claimId;  
    val.typeOperation = "Clarifications";
    this.transferService.singleClaimFormsSettings.next(val);
  
    this.router.navigate(['ourpages', 'ourcomponents', 'single-claim-forms']);
  }

  onClickRequestDocs(){
    let val = new SingleClaimFormsTransfer();
    val.claimId = this.claimId;  
    val.typeOperation = "QueryForm";
    this.transferService.singleClaimFormsSettings.next(val);
  
    this.router.navigate(['ourpages', 'ourcomponents', 'single-claim-forms']);
  }

  getDates(){

  }

  saveClaimUpdate(){
    this.claimData.claimId = this.claimData.id;
    this.httpService.updateClaim(this.claimData).subscribe({
      next: (response: any) => {
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {

      }
    }); 
  }


  get getUrlPDF(){
    let url = '';

    if(this.claimId) {
      url = 'https://APP0.chargebackoptimizer.com/api/v1/claim/'+ this.claimId +'/pdf/'
    }
    
    return url;
  }

  goBack(){
    this.router.navigate(['ourpages', 'ourcomponents', 'claims']);
  }

  get getClaimData_merch_name_ips(): string{
    if(this.claimData && this.claimData.merchant &&  this.claimData.merchant.name_ips )
      return this.claimData.merchant.name_ips;
    else 
      return '';
  }
 
  getDateFormat(date: any){
    if(date)
      return this.datePipe.transform(new Date(date), 'dd/MM/yyyy');
    else
      return '';
  }

}