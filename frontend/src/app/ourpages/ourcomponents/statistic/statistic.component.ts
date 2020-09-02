import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';
import { ClaimView } from '../../../share/models/claim-view.model';
import { DatePipe } from '@angular/common';
import { TransferService } from '../../../share/services/transfer.service';
import { HttpService } from '../../../share/services/http.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Bank } from '../../../share/models/bank.model';

@Component({
  selector: 'ngx-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit, OnDestroy {
  role: string;

  constructor(private datePipe: DatePipe, 
    private transferService: TransferService,
    private router: Router,
    private httpServise: HttpService) {
    
  }

  ngOnInit(): void {
    
    this.role = localStorage.getItem('role');
    //console.log('StatisticComponent role ' +this.role);

    // this.loadBankCountUpdatedClaims("1");
    // this.loadBankCountNewClaims("1");
    // this.loadCountUpdatedClaims();
    // this.loadCountNewClaims();
    this.loadCountClaimsByStages();
    // this.loadCountClaimsByRcGroup();
    // this.loadCountClaimsBySupport();

  }

  ngOnDestroy(): void{ }

  loadBankCountUpdatedClaims(bankId: string){
    //console.log('loadCountUpdatedClaims(bankId: string)');
    this.httpServise.getBankCountUpdatedClaims(bankId).subscribe({
      next: (response: any) => {
        
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
       
      }
    });

  }

  loadBankCountNewClaims(bankId: string){
    //console.log('loadCountNewClaims(bankId: string)');
    this.httpServise.getBankCountNewClaims(bankId).subscribe({
      next: (response: any) => {
        //console.log(response);
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
       
      }
    });

  }


  loadCountUpdatedClaims(){
    //console.log('loadCountUpdatedClaims()');
    this.httpServise.getCountUpdatedClaims().subscribe({
      next: (response: any) => {
        //console.log(response);
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
       
      }
    });

  }

  loadCountNewClaims(){
    //console.log('loadCountNewClaims()');
    this.httpServise.getCountNewClaims().subscribe({
      next: (response: any) => {
        //console.log(response);
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
       
      }
    });

  }

  
  loadCountClaimsByStages(){
    //console.log('getCountClaimsByStages()');
    this.httpServise.getCountClaimsByStages().subscribe({
      next: (response: any) => {
        console.log(response);
        console.log("BLA");
        console.log("BLAAA" + response['pre_mediation_claims']);
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
       
      }
    });

  }

  
  loadCountClaimsByRcGroup(){
    //console.log('getCountClaimsByRcGroup()');
    this.httpServise.getCountClaimsByRcGroup().subscribe({
      next: (response: any) => {
        //console.log(response);
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
       
      }
    });

  }

  loadCountClaimsBySupport(){
    //console.log('getCountClaimsBySupport()');
    this.httpServise.getCountClaimsBySupport().subscribe({
      next: (response: any) => {
        //console.log(response);
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
       
      }
    });

  }



}
