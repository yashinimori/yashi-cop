import { Registration } from "./registration.model";

export class BankUser extends Registration{
  id: number;
  userId: string; //имя пользователя
  unit: string;
  registration_date: string;
  bank_employee: string;
  
}
