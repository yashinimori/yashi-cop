import { Registration } from "./registration.model";

export class MerchUser extends Registration {
  id: number;
  bin: string;
  address: string;
  bank: any;
  contact_person: string;
  description: string;
  mcc: string;
  merch_id: string;
  name_ips: string;
  name_legal: string;
  user: number;
  term_id: string;
}
