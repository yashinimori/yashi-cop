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
  userId: any;
  fieldsStatus: FieldsStatus;
  isNewEscaltion: boolean;
  singleClaimFormsData: SingleClaimForms;
  typeOperation: string;
  reasonClosing: Array<SelectorData>;
  decision: Array<SelectorData>;
  responce: Array<SelectorData>;
  typeCard: string;
  reasonCode:Array<SelectorDataStr>;
  //acceptFiles = 'application/txt/, application/pdf, image/*, application/msword, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';
  acceptFiles = '*';

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
          
          let user = this.claimData['user'];
          if(user){
            this.userId = user['id'];
          }
          
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
    claim.id = this.claimId;

    claim.pan = this.claimData.pan;
    claim.claim_reason_code = this.claimData.claim_reason_code;
    claim.trans_approval_code = this.claimData.trans_approval_code;
    claim.trans_currency = this.claimData.trans_currency;
    claim.trans_date = this.claimData.trans_date;

    if(this.typeOperation == 'NewEscalation'){
      if(this.singleClaimFormsData.reason_code)
        claim.claim_reason_code = this.singleClaimFormsData.reason_code;
      if(this.singleClaimFormsData.mmt)  
        claim.mmt = this.singleClaimFormsData.mmt;
      if(this.singleClaimFormsData.comment)
        claim.comments = this.singleClaimFormsData.comment;
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
        if(this.singleClaimFormsData.decisionId)
          claim.officer_answer_reason = this.singleClaimFormsData.decisionId;
      } else {
        if(this.singleClaimFormsData.decisionId)
          arr.push(this.singleClaimFormsData.decisionId)
      }

      claim.comments = arr;
    }
        
    console.log(claim);
    this.httpService.updateClaim(claim).subscribe({
      next: (response: any) => {
        console.log('updateClaim ok');
        console.log(response); 
        this.uploadDoc(claim);
        this.commentClaim(claim.id, claim.comments, claim.form_name);
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
        this.transferService.cOPClaimID.next(this.claimId);

        if(this.typeOperation == 'FinishForm')
          this.router.navigate(['ourpages', 'ourcomponents', 'claims']);
        else
          this.router.navigate(['ourpages', 'ourcomponents', 'single-claim']);
      }
    });
    
  }

  uploadDoc(claim: any) {
    if(this.filesArr && this.filesArr.length > 0){
      let data = this.filesArr[0];
      console.log('uploadDoc()');
      console.log(data);
      
      this.httpService.uploadClaimDoc(data, "substitute_draft", this.claimId, 
        this.userId, claim.form_name).subscribe({
        next: (response: any) => {
          console.log('uploadDoc ok');
          console.log(response); 
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
        console.log('commentClaim ok');
        console.log(response); 
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {

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
    
    this.reasonCode.push({id:'0001', caption:"(139	4834) - ATM CASH NOT RECEIVED"});
    this.reasonCode.push({id:'0002', caption:"(138	4853) - Original Credit Transaction Not Accepted"});
    this.reasonCode.push({id:'0003', caption:"(137	4853) - Cancelled Merchandise/Services"});
    this.reasonCode.push({id:'0004', caption:"(136	4853) - Credit Not Processed"});
    this.reasonCode.push({id:'0005', caption:"(135	4853) - Misrepresentation"});
    this.reasonCode.push({id:'0006', caption:"(134	4853) - Counterfeit Merchandise"});
    this.reasonCode.push({id:'0007', caption:"(133	4853) - Not as Described or Defective Merchandise/Services"});
    this.reasonCode.push({id:'0008', caption:"(132	4853) - Canceled Recurring Transaction"});
    this.reasonCode.push({id:'0009', caption:"(131	4853) - Merchandise/Services Not Received	0009	"});
    this.reasonCode.push({id:'0010', caption:"(127	4808) - Invalid Data"});
    this.reasonCode.push({id:'0011', caption:"(126	4834) - Duplicate Processing"});
    this.reasonCode.push({id:'0012', caption:"(125	4834) - Incorrect Amount"});
    this.reasonCode.push({id:'0013', caption:"(124	4808) - Incorrect Account Number"});
    this.reasonCode.push({id:'0014', caption:"(123	4834) - Incorrect Currency"});
    this.reasonCode.push({id:'0015', caption:"(122	4853) - Incorrect Transaction Code"});
    this.reasonCode.push({id:'0016', caption:"(121	4808) - Late Presentment"});
    this.reasonCode.push({id:'0017', caption:"(113	4808) - No Authorization"});
    this.reasonCode.push({id:'0018', caption:"(112	4808) - Declined Authorization"});
    this.reasonCode.push({id:'0019', caption:"(111	4808) - Card Recovery Bulletin"});
    this.reasonCode.push({id:'0020', caption:"(105	4837) - Fraud Monitoring Program"});
    this.reasonCode.push({id:'0021', caption:"(104	4837) - Other Fraud: Card-absent Environment/Condition"});
    this.reasonCode.push({id:'0022', caption:"(103	4837) - Other Fraud: Card-Present Environment/Condition"});
    this.reasonCode.push({id:'0023', caption:"(102	4837) - EMV Liability Shift Non-Counterfeit Fraud"});
    this.reasonCode.push({id:'0024', caption:"(101	4837) - EMV Liability Shift Counterfeit Fraud"});
    this.reasonCode.push({id:'0025', caption:"(4834) - Charges for Loss, Theft, or Damages"});
    this.reasonCode.push({id:'0026', caption:"(4834) - “No-Show” Hotel Charge"});
    this.reasonCode.push({id:'0027', caption:"(126	4834) - Paid by Other Means"});
    this.reasonCode.push({id:'0100', caption:"() - Запит документів"});
    this.reasonCode.push({id:'0101', caption:"() - запитна проаналізований лог"});
    this.reasonCode.push({id:'0500', caption:"() - шнша причина запит на CHB OFF"});

  }



}
