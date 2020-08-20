import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EscalationTransfer } from '../models/escalation-transfer.model'

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  public cOPClaimID: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public pAD: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public escalationSettings: BehaviorSubject<EscalationTransfer> = new BehaviorSubject<EscalationTransfer>(null);
}
