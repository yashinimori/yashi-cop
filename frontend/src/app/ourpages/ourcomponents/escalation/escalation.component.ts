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

  constructor(private datePipe: DatePipe, 
    private transferService: TransferService, 
    private httpService: HttpService,
    private router: Router,
    private cdr: ChangeDetectorRef) { }

    
  ngOnInit(): void {
        
    this.role = localStorage.getItem('role');
    console.log('EscalationComponent this.role ' +this.role);
    this.generateStatusFields();

    this.isNewEscaltion = true;

    this.escalationData = new Escalation();
    this.claimId = this.transferService.escalationClaimID.getValue();
    console.log('EscalationComponent this.claimId ' +this.claimId);
  }

  ngOnDestroy(): void {
    this.transferService.escalationClaimID.next('');
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
    console.log(this.fieldsStatus);
  }

  onClickCreateEscalation(){
    //to do
    this.transferService.cOPClaimID.next(this.claimId);
    this.router.navigate(['ourpages', 'ourcomponents', 'single-claim']);
  }

  onClickBackClaim(){
    this.transferService.cOPClaimID.next(this.claimId);
    this.router.navigate(['ourpages', 'ourcomponents', 'single-claim']);
  }

}
