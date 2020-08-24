import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { TransferService } from '../../../share/services/transfer.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../share/services/http.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { SelectorData } from '../../../share/models/selector-data.model';
import { FormGroup, FormControl } from '@angular/forms';
import { FieldsStatus } from '../../../share/models/fieldsStatus.model';
import { ClaimView } from '../../../share/models/claim-view.model';
import { SingleClaimForms } from '../../../share/models/single-claim-forms.model';
import { SelectorDataStr } from '../../../share/models/selector-data-str.model';

@Component({
  selector: 'ngx-single-claim-forms',
  templateUrl: './single-claim-forms.component.html',
  styleUrls: ['./single-claim-forms.component.scss']
})
export class SingleClaimFormsComponent implements OnInit, OnDestroy {
  
  filesArr: Array<any> = new Array<any>();
  selectedFile: any;

  cOPClaimID: string;
  getEscalationSubscription: Subscription = new Subscription();
  claimData: ClaimView;

  role: string;
  claimId:any;
  fieldsStatus: FieldsStatus;
  isNewEscaltion: boolean;
  singleClaimFormsData: SingleClaimForms;
  typeOperation: string;
  reasonClosing: Array<SelectorData>;
  decision: Array<SelectorData>;
  responce: Array<SelectorData>;
  typeCard: string;
  reasonCode:Array<SelectorDataStr>;
  
  constructor(private datePipe: DatePipe, 
    private transferService: TransferService, 
    private httpService: HttpService,
    private router: Router,
    private cdr: ChangeDetectorRef) { }

    
  ngOnInit(): void {
        
    this.role = localStorage.getItem('role');
    console.log('SingleClaimFormsComponent this.role ' +this.role);
    this.generateStatusFields();

    this.singleClaimFormsData = new SingleClaimForms();
    this.filesArr = [];

    let v = this.transferService.singleClaimFormsSettings.getValue();
    // console.log('SingleClaimFormsComponent ');
    // console.log(v);
    this.claimId = v.claimId;
    this.typeOperation = v.typeOperation;

    this.getReasonClosing();
    this.getDecision();
    this.getResponce();
    this.getReasonCode();

    this.loadClaim();

    
  }

  ngOnDestroy(): void {
    this.transferService.singleClaimFormsSettings.next(null);
    this.getEscalationSubscription.unsubscribe();
  }

  
  loadClaim() {
    console.log('loadClaim');
    this.httpService.getSingleClaim(this.claimId).subscribe({
        next: (response: any) => {
          this.claimData = response;
          console.log(this.claimData);
          
        },
        error: error => {
          console.error('There was an error!', error);
        },
        complete: () => {
         
        }
      });
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
 
   
  public get getDateTrans(){
    if(this.claimData && this.claimData.trans_date){
      return this.datePipe.transform(new Date(this.claimData.trans_date), 'dd-MM-yyyy hh:mm:ss');
    } else {
      return '';
    }
    
  }

  
  generateStatusFields() {
    this.fieldsStatus = new FieldsStatus();
    this.fieldsStatus.setStatusByRole(this.role);
    console.log('generateStatusFields()');
    console.log(this.fieldsStatus);
  }

  onClickApply(){
    
    let claim = new ClaimView();
    claim.claimId = this.claimId;

    claim.pan = this.claimData.pan;
    claim.claim_reason_code = this.claimData.claim_reason_code;
    claim.trans_approval_code = this.claimData.trans_approval_code;
    claim.trans_currency = this.claimData.trans_currency;
    claim.trans_date = this.claimData.trans_date;

    if(this.typeOperation == 'NewEscalation'){
      claim.claim_reason_code = this.singleClaimFormsData.reason_code;
      claim.mmt = this.singleClaimFormsData.mmt;
      claim.form_name ='escalate_form';
    }

    if(this.typeOperation == 'Clarifications'){
      claim.comments = this.singleClaimFormsData.comment;
      claim.form_name ='clarify_form';
    }

    if(this.typeOperation == 'FinishForm'){
      claim.form_name ='close_form';
      
      let arr: Array<string> = new Array<string>();
      if(this.singleClaimFormsData.reasonClosingId)
        arr.push(this.singleClaimFormsData.reasonClosingId)
      
      if(this.singleClaimFormsData.responceId)
        arr.push(this.singleClaimFormsData.responceId)
      
      if(this.singleClaimFormsData.comment)
        arr.push(this.singleClaimFormsData.comment)

      if(this.singleClaimFormsData.amount_move)
        arr.push(this.singleClaimFormsData.amount_move)

      if(this.role == 'chargeback_officer') {
        claim.result = this.singleClaimFormsData.decisionId;
      } else {
        if(this.singleClaimFormsData.decisionId)
          arr.push(this.singleClaimFormsData.decisionId)
      }

      claim.comments = arr;
    }



    if(this.filesArr && this.filesArr.length > 0) {
      let data = this.filesArr[0];
      const formData: FormData = new FormData();
      formData.append('docs', data, data.name);
      this.singleClaimFormsData.docs = data;
      claim.documents = this.singleClaimFormsData.docs;
    }
        
    //console.log(this.singleClaimFormsData);

    console.log(claim);
    this.httpService.updateClaim(claim).subscribe({
      next: (response: any) => {
        console.log('ok');
        console.log(response); 
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
        this.transferService.cOPClaimID.next(this.claimId);
        this.router.navigate(['ourpages', 'ourcomponents', 'single-claim']);
      }
    });
    
  }

  onClickBackClaim(){
    this.transferService.cOPClaimID.next(this.claimId);
    this.router.navigate(['ourpages', 'ourcomponents', 'single-claim']);
  }


  getReasonClosing(){

    this.reasonClosing = new Array<SelectorData>();

    if(this.role == 'cardholder'){
      this.reasonClosing.push({id:1, caption:"я отримав необхідні документи та згоден завершити розгляд"});
      this.reasonClosing.push({id:2, caption:"я згоден з результатами розгляду"});
      this.reasonClosing.push({id:3, caption:"мою скаргу задоволено"});
      this.reasonClosing.push({id:4, caption:"я ознайомився з результатами та не буду продовжувати розгляд претензії"});
      this.reasonClosing.push({id:5, caption:"інше"});
    } else if(this.role == 'chargeback_officer'){
      this.reasonClosing.push({id:1, caption:"претензію розглянуто"});
      this.reasonClosing.push({id:2, caption:"претензію відхилено, неправомірна заява"});
      this.reasonClosing.push({id:3, caption:"претензію відхилено, некоректні дані"});
    }
    
  }

  getDecision(){
    this.decision = new Array<SelectorData>();
    if(this.role == 'merchant') {
      this.decision.push({id:1, caption:"згодні прийняти претензію та зробити повернення"});
      this.decision.push({id:2, caption:"претензію відхилено"});
    } else if(this.role == 'chargeback_officer'){
      this.decision.push({id:1, caption:"повернення погоджено, очікуйте зарахування"});
      this.decision.push({id:2, caption:"часткове погоджено, очікуйте зарахування"});
      this.decision.push({id:3, caption:"в поверненні відмовлено, документи додаються"});
      this.decision.push({id:4, caption:"в поверненні відмовлено, коментарі додаються"});
    }
  
  }

  getResponce(){
    
    this.responce = new Array<SelectorData>();

    if(this.role == 'merchant') {
      this.responce.push({id:1, caption:"документи в наявності, надаємо чек"});
      this.responce.push({id:2, caption:"документи в наявності, доказ участі клієнта у транзакції"});
      this.responce.push({id:3, caption:"повернення товарів підтверджено, кошти будуть повернені"});
      this.responce.push({id:4, caption:"послугу було надано, підтвердження надаємо"});
      this.responce.push({id:5, caption:"товар було отримано, підтвердження надаємо"});
      this.responce.push({id:6, caption:"переказ був помилковим, кошти будуть повернені"});
      this.responce.push({id:7, caption:"претензію прийнято, кошти будуть повернені"});
    }
    
  }

  getReasonCode(){
    
    this.reasonCode = new Array<SelectorDataStr>();
    
    this.reasonCode.push({id:'139', caption:"139 - ATM CASH NOT RECEIVED"});
    this.reasonCode.push({id:'138', caption:"138 - Original Credit Transaction Not Accepted"});
    this.reasonCode.push({id:'137', caption:"137 - Cancelled Merchandise/Services"});
    this.reasonCode.push({id:'136', caption:"136 - Credit Not Processed"});
    this.reasonCode.push({id:'135', caption:"135 - Misrepresentation"});
    this.reasonCode.push({id:'134', caption:"134 - Counterfeit Merchandise"});

    this.reasonCode.push({id:'4853', caption:"4853 - Not as Described or Defective Merchandise/Services	"});
    this.reasonCode.push({id:'4853', caption:"4853 - Canceled Recurring Transaction"});
    this.reasonCode.push({id:'4853', caption:"4853 - Merchandise/Services Not Received"});
    this.reasonCode.push({id:'4808', caption:"4808 - Invalid Data"});
    this.reasonCode.push({id:'4834', caption:"4834 - Duplicate Processing"});
    
  }



}
