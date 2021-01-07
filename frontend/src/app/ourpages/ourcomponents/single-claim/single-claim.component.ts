import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, AfterViewInit, ChangeDetectorRef, HostListener, Output, EventEmitter } from '@angular/core';
import { TransferService } from '../../../share/services/transfer.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../share/services/http.service';
import { Observable, of, Subscription } from 'rxjs';
import { ClaimView } from '../../../share/models/claim-view.model';
import { DatePipe } from '@angular/common';
import { SelectorData } from '../../../share/models/selector-data.model';
import { FormGroup, FormControl } from '@angular/forms';
import { FieldsStatus } from '../../../share/models/fieldsStatus.model';
import { SingleClaimFormsTransfer } from '../../../share/models/single-claim-forms-transfer.model';
import { ClaimComment } from '../../../share/models/claim-comment.model';
import { ClaimDocument } from '../../../share/models/claim-document.model';
import { TimelineView } from '../../../share/models/timeline-view.model'
import {MerchUser} from '../../../share/models/merch-user.model';
import {MAIN_URL} from '../../../share/urlConstants';
import { map, startWith } from 'rxjs/operators';
import { ErrorService } from '../../../share/services/error.service';
import { NbGlobalPhysicalPosition, NbPopoverDirective, NbToastrService } from '@nebular/theme';
import {Location} from '@angular/common';
import { ToastService } from '../../../share/services/toast.service';

@Component({
  selector: 'ngx-single-claim',
  templateUrl: './single-claim.component.html',
  styleUrls: ['./single-claim.component.scss']
})
export class SingleClaimComponent implements OnInit, OnDestroy, AfterViewInit { 
  options: string[];
  inputFormControlMerchUser: FormControl;
  filteredControlOptionsMerchUser$: Observable<string[]>;

  constructor(private datePipe: DatePipe,
              private transferService: TransferService,
              private httpService: HttpService,
              private _location: Location, private toastService: ToastService,
              private router: Router, private toastrService: NbToastrService,
              private cdr: ChangeDetectorRef, private errorService: ErrorService) {
    this.claimData = new ClaimView();
  }

  @ViewChild('one') one: TemplateRef<any>;
  @ViewChild('two') two: TemplateRef<any>;
  @ViewChild('three') three: TemplateRef<any>;
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

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler($event) {
    if (this.claimId && this.claimId != 0) {
      localStorage.setItem('claimId', this.claimId);
    }
  }

  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;
  copyEmit(event) {
    if(event) {
      this.popover.show();
      setTimeout(() => {
        this.popover.hide();
      }, 2000);
    }
  }

  filesArr: Array<any> = new Array<any>();
  selectedFile: any;

  filesLogArr: Array<any> = new Array<any>();
  selectedFileLog: any;

  previousPart = 'one';
  part = 'one';

  loadingSaveEdit = false;
  loadingCreateNewClaim = false;

  cOPClaimID: string;
  isNewRecord: boolean = true;
  isUIloaded: boolean = false;
  getClaimSubscription: Subscription = new Subscription();
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  subscription3: Subscription = new Subscription();
  subscription4: Subscription = new Subscription();
  subscription5: Subscription = new Subscription();
  subscription6: Subscription = new Subscription();
  subscription7: Subscription = new Subscription();
  subscription8: Subscription = new Subscription();
  subscription9: Subscription = new Subscription();
  claimData: ClaimView;
  Timeline: Array<TimelineView>;
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
  isSaveClaimId: boolean = false;
  isVisibleBackStepButton: boolean = false;
  isGoToNextStep: boolean = false;
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

  reasonCodesArr: Array<any> = new Array<any>();
  readonlyReasonCodesArr: Array<any> = new Array<any>();
  isReasonCodeInputValid: boolean = false;

  ngOnInit(): void {
    this.inputFormControlMerchUser = new FormControl();
    this.claimData = new ClaimView();
    this.Timeline = new Array<TimelineView>();
    this.claimData.user = {};

    this.role = localStorage.getItem('role');
    if(this.role == 'chargeback_officer') {
      this.getReasonCodes();
    }
    if(localStorage.getItem('claimId')) {
      this.claimId = localStorage.getItem('claimId');
    } else {
      this.claimId = this.transferService.cOPClaimID.getValue();
    }
    if(this.claimId.length == 0) {
      this.isSaveClaimId = false;
      this.router.navigate(['cop', 'cabinet', 'claims', 'all']); 
      return;
    }

    if (this.claimId != '0') {
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
    this.isNewRecord = this.claimId == '0' ? true : false;
    // this.isNewRecord = this.claimId.length == 0 ? true : false;

    // if(!this.isNewRecord){
    //   this.loadClaim();
    // } else {
    //   this.getListMerchant();
    //   this.getListCurrency();
    //   this.getListQuestions();
    // }

    this.getListMerchant(()=>{
      this.options = new Array<string>();
      this.merchantsArr.forEach(el=>{
        this.options.push(el.name_ips);
      });
      this.filteredControlOptionsMerchUser$ = of(this.options);
      this.inputFormControlMerchUser = new FormControl();

      this.filteredControlOptionsMerchUser$ = this.inputFormControlMerchUser.valueChanges
        .pipe(
          startWith(''),
          map(filterString => this.filterMerch(filterString)),
        );
    });

    this.getListCurrency();
    this.getListQuestions();
    this.getDates();
    //this.loadClaimDocumsnts();
  }

  showToast() {
    this.toastrService.show(
      'Завантажуйте лише фото або pdf файли',
      `Такий тип файлу не підтримується.`,
      { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'warning', duration: 5000 });
  }

  onSelectionChangeMerch($event){
    let f = this.merchantsArr.find(i=>i.merch_id == $event || i.name_ips == $event);
    if(f){
      this.claimData.merch_id = f.merch_id;
    }
  }

  private filterMerch(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
  }

  ngOnDestroy(): void {
    if(this.isSaveClaimId) {
      localStorage.setItem('claimId', this.claimId);
    } else if(localStorage.getItem('claimId')) {
      localStorage.removeItem('claimId');
    }
    this.transferService.cOPClaimID.next('');
    this.getClaimSubscription.unsubscribe();
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    this.subscription4.unsubscribe();
    this.subscription5.unsubscribe();
    this.subscription6.unsubscribe();
    this.subscription7.unsubscribe();
    this.subscription8.unsubscribe();
  }

  ngAfterViewInit() {
    this.part = 'one';
    this.cdr.detectChanges();
  }

  timeline(){
    this.subscription8 = this.httpService.getTimeLine(this.claimId).subscribe({
        next: (response: any) => {
          this.Timeline = response;
        },
        error: error => {
          this.errorService.handleError(error);
          console.error('There was an error!', error);
        },
        complete: () => {
        }
      });
  }

  getReasonCodes() {
    this.httpService.getReasonCodes().subscribe({
      next: (response: any) => {
        this.reasonCodesArr = response.results;
        console.log(this.reasonCodesArr)
        this.readonlyReasonCodesArr = JSON.parse(JSON.stringify(response.results));
        console.log(response)
      },
      error: error => {
        this.errorService.handleError(error);
        console.error('There was an error!', error);
      },
      complete: () => {
      }
    });
  }

  checkPanForReasonCodeCb() {
    if(this.role == 'chargeback_officer') {
      if(this.claimData.pan[0] == '4') {
        this.reasonCodesArr = JSON.parse(JSON.stringify(this.readonlyReasonCodesArr));
        this.filterReasonCodesArr('visa');
      } else if(this.claimData.pan[0] == '5' || this.claimData.pan[0] == '6') {
        this.reasonCodesArr = JSON.parse(JSON.stringify(this.readonlyReasonCodesArr));
        this.filterReasonCodesArr('mastercard');
      } else {
        this.isReasonCodeInputValid = false;
      }
    }
  }

  filterReasonCodesArr(type:string) {
    if(type == 'visa') {
      this.reasonCodesArr = this.reasonCodesArr.filter(e => e.visa != null);
    } else {
      this.reasonCodesArr = this.reasonCodesArr.filter(e => e.mastercard != null);
    }
    this.isReasonCodeInputValid = true;
    
  }

  loadClaim() {
    this.subscription1 = this.httpService.getSingleClaim(this.claimId).subscribe({
        next: (response: any) => {
          this.claimData = response;
          this.setClaimComments();
          this.setClaimDocumsnts();
        },
        error: error => {
          this.errorService.handleError(error);
          console.error('There was an error!', error);
        },
        complete: () => {
          this.isUIloaded = true;
        }
      });
  }

  public get getUserName(){
    let userName = '';
    if(this.claimData && this.claimData.user ){
      if(this.claimData.user.first_name)
        userName = this.claimData.user.first_name;
      if(this.claimData.user.last_name)
        userName += this.claimData.user.last_name;
    }
    return userName;
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
    this.subscription2 = this.httpService.getClaimDocs(this.claimId).subscribe({
      next: (response: any) => {
      },
      error: error => {
        this.errorService.handleError(error);
        console.error('There was an error!', error);
      },
      complete: () => {
      }
    });
  }

  lastStep(code:string) {
    this.claimData.claim_reason_code = code;
    this.claimData.comment = this.claimData.ch_comments;
    // this.claimData.ch_comments = [{'text': this.claimData.ch_comments}];
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

      this.subscription3 = this.httpService.uploadClaimDoc(data, "substitute_draft", claim.id,
        claim.user.id, '').subscribe({
        next: (response: any) => {
          this.filesArr = [];
        },
        error: error => {
          this.errorService.handleError(error);
          console.error('There was an error!', error);
        },
        complete: () => {
        }
      });
    }
  }

  commentClaim(claimId: any, comment: any, form_name: any) {
    this.subscription4 = this.httpService.commentClaim(claimId, comment, form_name).subscribe({
      next: (response: any) => {
      },
      error: error => {
        this.errorService.handleError(error);
        console.error('There was an error!', error);
      },
      complete: () => {
      }
    });
  }

  saveClaim() {
    this.loadingCreateNewClaim = true;
    this.claimData.comment = this.claimData.ch_comments;
    //this.claimData.ch_comments = [{'text': this.claimData.ch_comments}];
    //this.claimData.form_name = 'claim_form';
    //this.claimData.trans_date = new Date(this.claimData.trans_date) + new Date().getTimezoneOffset();
    let lt = (new Date().getTimezoneOffset() * -1 * 60000) + 2000;
    this.claimData.trans_date = new Date(this.claimData.trans_date.getTime() + lt);
    this.subscription5 = this.httpService.createNewClaim(this.claimData).subscribe({
      next: (response: any) => {
        this.uploadDoc(response);
        if(this.claimData.comment){
          this.commentClaim(response['id'], this.claimData.comment, '');
        }
      },
      error: error => {
        this.loadingCreateNewClaim = false;
        this.errorService.handleError(error);
        this.errorService.handleErrorToast(error);
        console.error('There was an error!', error);
      },
      complete: () => {
        this.toastService.showSuccessToast();
        this.loadingCreateNewClaim = false;
        this.isSaveClaimId = false;
        this.router.navigate(['cop', 'cabinet', 'claims', 'all']); 
      }
    });
  }

  onClickBackStep() {
    if(!this.isLastStep) {
      this.editedAnswers.pop();
    }
    this.part = this.previousPart;
    this.isGoToNextStep = false;
    this.isLastStep = false;
    this.isVisibleBackStepButton = false;
  }

  change(par: any) {
    switch(par.part) {
      case 'one':
        if(par.formGroups.controls.groupQuery1.touched) {
          this.isGoToNextStep = false;
          this.editedAnswers.push({"1": par.formGroups.value.groupQuery1.val == 1? false:true});
          this.previousPart = 'one';
          if(par.formGroups.value.groupQuery1.val == 1) {
            this.part = 'two';
          } else {
            this.part = 'five';
          }
        } else {
          this.isGoToNextStep = true;
        } 
        break;
      case 'two':
        if(par.formGroups.controls.groupQuery2.touched) {
          this.isGoToNextStep = false;
          this.editedAnswers.push({"2": par.formGroups.value.groupQuery2.text});
          this.previousPart = 'two';
          if(par.formGroups.value.groupQuery2.val == 3) {
            this.part = 'five';
          } else {
            this.part = 'three';
          }
        } else {
          this.isGoToNextStep = true;
        }
        break;
      case 'three':
        if(par.formGroups.controls.groupQuery3.touched) {
          this.isGoToNextStep = false;
          this.editedAnswers.push({"3": par.formGroups.value.groupQuery3.text});
          this.previousPart = 'three';
          if(par.formGroups.value.groupQuery3.val == 1) {
            this.lastStep('0500');
          } else {
            this.part = 'four';
          }
        } else {
          this.isGoToNextStep = true;
        }
        break;
      case 'four':
        if(par.formGroups.controls.groupQuery4.touched) {
          this.isGoToNextStep = false;
          this.editedAnswers.push({"4": par.formGroups.value.groupQuery4});
          this.previousPart = 'four';
          this.lastStep('0021');
        } else {
          this.isGoToNextStep = true;
        }
        break;
      case 'five':
        if(par.formGroups.controls.groupQuery5.touched) {
          this.isGoToNextStep = false;
          this.editedAnswers.push({"5": par.formGroups.value.groupQuery5.text});
          this.previousPart = 'five';
          if(par.formGroups.value.groupQuery5.val == 1) {
            this.lastStep('0100');
          } else {
            this.part = 'six';
          }
        } else {
          this.isGoToNextStep = true;
        }
        break;
      case 'six':
        if(par.formGroups.controls.groupQuery6.touched) {
          this.isGoToNextStep = false;
          this.editedAnswers.push({"6": par.formGroups.value.groupQuery6.text});
          this.previousPart = 'six';
          if(par.formGroups.value.groupQuery6.val == 1) {
            this.part = 'seven';
          } else {
            this.part = 'ten';
          }
        } else {
          this.isGoToNextStep = true;
        }
        break;
      case 'seven':
        if(par.formGroups.controls.groupQuery7.touched) {
          this.isGoToNextStep = false;
          this.editedAnswers.push({"7": par.formGroups.value.groupQuery7.text});
          this.previousPart = 'seven';
          if(par.formGroups.value.groupQuery7.val == 1) {
            this.lastStep('0500');
          } else {
            this.part = 'eight';
          }
        } else {
          this.isGoToNextStep = true;
        }
        break;
      case 'eight':
        if(par.formGroups.controls.groupQuery8.touched) {
          this.isGoToNextStep = false;
          this.editedAnswers.push({"8": par.formGroups.value.groupQuery8.text});
          this.previousPart = 'eight';
          if(par.formGroups.value.groupQuery8.val == 1) {
            this.part = 'nine';
          } else {
            this.lastStep('0001');
          }
        } else {
          this.isGoToNextStep = true;
        }
        break;
      case 'nine':
        if(par.formGroups.controls.groupQuery9.touched) {
          this.isGoToNextStep = false;
          this.editedAnswers.push({"9": par.formGroups.value.groupQuery9});
          this.previousPart = 'nine';
          this.lastStep('0001');
        } else {
          this.isGoToNextStep = true;
        }
        break;
      case 'ten':
        if(par.formGroups.controls.groupQuery10.touched) {
          this.isGoToNextStep = false;
          this.editedAnswers.push({"10": par.formGroups.value.groupQuery10.val == 1? true:false});
          this.previousPart = 'ten';
          this.part = 'eleven';
        } else {
          this.isGoToNextStep = true;
        }
        break;
      case 'eleven':
        if(par.formGroups.controls.groupQuery11.touched) {
          this.isGoToNextStep = false;
          this.editedAnswers.push({"11": par.formGroups.value.groupQuery11.val == 1? false:true});
          this.previousPart = 'eleven';
          if(par.formGroups.value.groupQuery11.val == 1) {
            this.lastStep('0009');
          } else {
            this.part = 'twelve';
          }
        } else {
          this.isGoToNextStep = true;
        }
        break;
      case 'twelve':
        if(par.formGroups.controls.groupQuery12.touched) {
          this.isGoToNextStep = false;
          this.editedAnswers.push({"12": par.formGroups.value.groupQuery12.caption});
          this.previousPart = 'twelve';
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
        } else {
          this.isGoToNextStep = true;
        }
        break;
      case 'thirteen':
        if(par.formGroups.controls.groupQuery13.touched) {
          this.isGoToNextStep = false;
          this.editedAnswers.push({"13": par.formGroups.value.groupQuery13.text});
          this.previousPart = 'thirteen';
          this.lastStep('0027');
        } else {
          this.isGoToNextStep = true;
        }
        break;
      case 'fourteen':
        if(par.formGroups.controls.groupQuery14.touched) {
          this.isGoToNextStep = false;
          this.editedAnswers.push({"14": this.claimData.trans_date});
          this.previousPart = 'fourteen';
          this.lastStep('0004');
        } else {
          this.isGoToNextStep = true;
        }
        break;
      case 'fiveteen':
        if(par.formGroups.controls.groupQuery15.touched) {
          this.isGoToNextStep = false;
          this.editedAnswers.push({"15": par.formGroups.value.groupQuery15.val == 1? true:false});
          this.previousPart = 'fiveteen';
          this.lastStep('0009');
        } else {
          this.isGoToNextStep = true;
        }
        break;
      case 'sixteen':
        if(par.formGroups.controls.groupQuery16.touched) {
          this.isGoToNextStep = false;
          this.editedAnswers.push({"16": par.formGroups.value.groupQuery16});
          this.previousPart = 'sixteen';
          this.lastStep('0012');
        } else {
          this.isGoToNextStep = true;
        }
        break;
      case 'seventeen':
        if(par.formGroups.controls.groupQuery17.touched) {
          this.isGoToNextStep = false;
          this.editedAnswers.push({"17": par.formGroups.value.groupQuery17});
          this.previousPart = 'seventeen';
          if(par.formGroups.value.groupQuery17.val == 1) {
            this.part = 'fiveteen';
          } else {
            this.lastStep('0009');
          }
        } else {
          this.isGoToNextStep = true;
        }
        break;
    }
    this.isVisibleBackStepButton = true;

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
    if(this.selectedFile.type != 'application/pdf' && this.selectedFile.type != 'image/png' && this.selectedFile.type != 'image/jpeg') {
      this.showToast();
    } else if(this.selectedFile.size > 50000000) {
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
    if(!this.checkData()){
      return;
    }
    this.part = 'one';
    this.stepNewRecord = 2;
    this.cdr.detectChanges();
  }

  onClickGoNextStepCb(){
    if(!this.checkData()){
      return;
    }
    this.claimData.comment = this.claimData.ch_comments;
    this.isLastStep = true;
    this.claimData.answers = {};
    this.stepNewRecord = 3;
    this.cdr.detectChanges();
  }

  public get getCheckData(): boolean{
    let d =this.checkData(); 
    return d;
  }

  public checkData(){
    if(!this.claimData)
      return false;
    
    if(!this.claimData.pan)
      return false;

    if(!this.claimData.trans_date)
      return false;

    if(!this.claimData.term_id)
      return false;

    if(!this.claimData.trans_amount)
      return false;
      
    if(!this.claimData.trans_currency)
      return false;

    if(this.role == 'chargeback_officer' && !this.claimData.claim_reason_code)
      return false;

    return true;
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

  getListMerchant(callback){
    this.merchantsArr = new Array<MerchUser>();

    this.subscription6 = this.httpService.getMerchantsAll().subscribe({
        next: (response: any) => {
          this.merchantsArr = response;
        },
        error: error => {
          this.errorService.handleError(error);
          console.error('There was an error!', error);
        },
        complete: () => {
          callback();
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
    this.isSaveClaimId = true;
    this.router.navigate(['cop', 'cabinet', 'single-claim-forms']);
  }

  onClickFinish(){
    let val = new SingleClaimFormsTransfer();
    val.claimId = this.claimId;
    val.typeOperation = "FinishForm";
    this.transferService.singleClaimFormsSettings.next(val);
    this.isSaveClaimId = true;
    this.router.navigate(['cop', 'cabinet', 'single-claim-forms']);
  }

  onClickClarifications(){
    let val = new SingleClaimFormsTransfer();
    val.claimId = this.claimId;
    val.typeOperation = "Clarifications";
    this.transferService.singleClaimFormsSettings.next(val);
    this.isSaveClaimId = true;
    this.router.navigate(['cop', 'cabinet', 'single-claim-forms']);
  }

  onClickRequestDocs(){
    let val = new SingleClaimFormsTransfer();
    val.claimId = this.claimId;
    val.typeOperation = "QueryForm";
    this.transferService.singleClaimFormsSettings.next(val);
    this.isSaveClaimId = true;
    this.router.navigate(['cop', 'cabinet', 'single-claim-forms']);
  }

  getDates(){

  }

  saveClaimUpdate(){
    this.loadingSaveEdit = true;
    this.claimData.claimId = this.claimData.id;
    this.subscription7 = this.httpService.updateClaim(this.claimData).subscribe({
      next: (response: any) => {
      },
      error: error => {
        this.loadingSaveEdit = false;
        this.errorService.handleError(error);
        this.errorService.handleErrorToast(error);
        console.error('There was an error!', error);
      },
      complete: () => {
        this.toastService.showSuccessToast();
        this.loadingSaveEdit = false;
      }
    });
  }

  get getUrlPDF() {
    let url = '';
    if (this.claimId) {
      url = `${MAIN_URL}/api/v1/claim/${this.claimId}/pdf/`;
    }

    return url;
  }

  goBack(){
    this.isSaveClaimId = false;
    this._location.back();
    //this.router.navigate(['cop', 'cabinet', 'claims']);
  }

  get getClaimData_merch_name_ips(): string{
    if(this.claimData && this.claimData.merchant &&  this.claimData.merchant.name_ips )
      return this.claimData.merchant.name_ips;
    else
      return '';
  }

  getDateFormat(date: any){
    if(date)
      return this.datePipe.transform(new Date(date), 'dd/MM/yyyy HH:mm');
    else
      return '';
  }

}
