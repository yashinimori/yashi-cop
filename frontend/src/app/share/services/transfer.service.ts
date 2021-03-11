import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SingleClaimFormsTransfer } from '../models/single-claim-forms-transfer.model';
import { DoughnutTransfer } from '../models/doughnut.transfer.model';

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  public cOPClaimID: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public pAD: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public singleClaimFormsSettings: BehaviorSubject<SingleClaimFormsTransfer> = new BehaviorSubject<SingleClaimFormsTransfer>(null);
  public bankID: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public bankBIN: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public userID: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public claimsByStages: BehaviorSubject<DoughnutTransfer> = new BehaviorSubject<DoughnutTransfer>(null);
  public claimsByRcGroup: BehaviorSubject<DoughnutTransfer> = new BehaviorSubject<DoughnutTransfer>(null);

  public atmID: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public bankUserID: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public merchantID: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public transactionID: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public transactionMastercardID: BehaviorSubject<number> = new BehaviorSubject<number>(null);
}
