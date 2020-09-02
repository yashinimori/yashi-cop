import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SingleClaimFormsTransfer } from '../models/single-claim-forms-transfer.model';

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
}
