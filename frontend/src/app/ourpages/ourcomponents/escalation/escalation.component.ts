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
import { Escalation } from '../../../share/models/escalation.model';

@Component({
  selector: 'ngx-escalation',
  templateUrl: './escalation.component.html',
  styleUrls: ['./escalation.component.scss']
})
export class EscalationComponent implements OnInit, OnDestroy {
  
  filesArr: Array<any> = new Array<any>();
  selectedFile: any;

  cOPClaimID: string;
  getEscalationSubscription: Subscription = new Subscription();
  claimData: ClaimView;

  role: string;
  claimId:any;
  fieldsStatus: FieldsStatus;
  isNewEscaltion: boolean;
  escalationData: Escalation;
  typeOperation: string;
  reasonClosing: Array<SelectorData>;
  decision: Array<SelectorData>;
  
  constructor(private datePipe: DatePipe, 
    private transferService: TransferService, 
    private httpService: HttpService,
    private router: Router,
    private cdr: ChangeDetectorRef) { }

    
  ngOnInit(): void {
        
    this.role = localStorage.getItem('role');
    console.log('EscalationComponent this.role ' +this.role);
    this.generateStatusFields();

    this.escalationData = new Escalation();
    this.filesArr = [];

    let v = this.transferService.escalationSettings.getValue();
    // console.log('EscalationComponent ');
    // console.log(v);
    this.claimId = v.claimId;
    this.typeOperation = v.typeOperation;

    this.getReasonClosing();
    this.getDecision();

  }

  ngOnDestroy(): void {
    this.transferService.escalationSettings.next(null);
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

  onClickCreateEscalation(){
    //to do
    
    if(this.filesArr && this.filesArr.length > 0) {
      let data = this.filesArr[0];
      const formData: FormData = new FormData();
      formData.append('docs', data, data.name);
      this.escalationData.docs = data;
    }
        
    console.log(this.escalationData);

    this.transferService.cOPClaimID.next(this.claimId);
    this.router.navigate(['ourpages', 'ourcomponents', 'single-claim']);
  }

  onClickBackClaim(){
    this.transferService.cOPClaimID.next(this.claimId);
    this.router.navigate(['ourpages', 'ourcomponents', 'single-claim']);
  }


  getReasonClosing(){
    this.reasonClosing = new Array<SelectorData>();
    this.reasonClosing.push({id:1, caption:"reasonClosing 1"});
    this.reasonClosing.push({id:2, caption:"reasonClosing 2"});
    this.reasonClosing.push({id:3, caption:"reasonClosing 3"});
  }

  getDecision(){
    this.decision = new Array<SelectorData>();
    this.decision.push({id:1, caption:"decision 1"});
    this.decision.push({id:2, caption:"decision 2"});
    this.decision.push({id:3, caption:"decision 3"});
  }

}
