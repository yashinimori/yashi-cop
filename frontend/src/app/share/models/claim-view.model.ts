import {ClaimRegistration} from './claim-registration.model';

export class ClaimView extends ClaimRegistration {
  claim_id: string;
  merch_name_ips: string;
  reason_code_group: string;
  status: string;
  action_needed: string;
  result: string;
  due_date: Date;
  currency_name: string;
  fio: string;
  arn: string;
  answers: any;
  claim_reason_code: string;
  trans_approval_code: string;
  ch_comments: any;
  trans_amount: any;
  trans_currency: any;
  merchant: any;
  comments: any;
  documents: any;
  claimId: string;
  form_name: string;
  mmt: string;
  officer_answer_reason: string;
  user: any;
  create_date: Date;
  update_date: Date;
  chargeback_date: Date;
  second_presentment_date: Date;
  pre_arbitration_date: Date;
  pre_arbitration_response_date: Date;
  arbitration_date: Date;
  arbitration_response_date: Date;
  openClaim: string;
  flag: boolean;
}
