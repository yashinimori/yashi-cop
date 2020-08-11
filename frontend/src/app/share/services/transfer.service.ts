import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  public cOPClaimID: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public pAD: BehaviorSubject<string> = new BehaviorSubject<string>('');
}
