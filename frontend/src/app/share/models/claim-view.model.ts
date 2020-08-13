import { ClaimRegistration } from './claim-registration.model';

export class ClaimView extends ClaimRegistration {
  claim_id: string;
  merch_name_ips: string;
  reason_code_group: string;
  stage: string;
  action_needed: string;
  result: string;
  due_date: Date;
  currency_name: string;
  fio: string;
  arn: string;
  answers: any;
  claim_reson_code:string;
  trans_approval_code:string;
  ch_comments:string;
  trans_amount:any;
  trans_currency:any;

}
