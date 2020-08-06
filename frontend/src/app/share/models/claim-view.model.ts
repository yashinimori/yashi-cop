import { ClaimRegistration } from './claim-registration.model';

export class ClaimView extends ClaimRegistration {
  cOPClaimID: number;
  merchantName: string;
  reasonCodeGroup: number;
  stage: string;
  action: string;
  result: string;
  dueDate: Date;
}
