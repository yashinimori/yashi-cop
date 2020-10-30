import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { TransferService } from '../../../share/services/transfer.service';
import { HttpService } from '../../../share/services/http.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Bank } from '../../../share/models/bank.model';

@Component({
  selector: 'ngx-bank-list',
  templateUrl: './bank-list.component.html',
  styleUrls: ['./bank-list.component.scss']
})
export class BankListComponent implements OnInit, OnDestroy {
  banksData: Array<Bank>;
  settings: any;
  source: LocalDataSource;
  role: string;
  pagerSize = 10;

  constructor(private transferService: TransferService,
    private router: Router,
    private httpServise: HttpService) {
    this.banksData = new Array<Bank>();
  }

  banksSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    this.setSettingsGrid(this.role);
    this.getBanksData();
    //this.hideColumnForUser(this.role);
  }

  onUserRowSelect(event): void {
    this.transferService.bankID.next(event.data.id);
    this.transferService.bankBIN.next(event.data.bin);
    this.router.navigate(['cop', 'cabinet', 'bank-single']);
  }

  // hideColumnForUser(role:string){
  //   if(role && (role == 'cardholder' || role == 'user')){
  //       delete this.settings.columns.id;
  //   }
  // }
  
  setSettingsGrid(role:string){
    switch(role){
      case 'admin':
      case 'cop_manager':
      case 'chargeback_officer':  {
        this.settings = {
          pager:{perPage: this.pagerSize},
          //hideSubHeader: true,
          actions:{
            add: false,
            edit: false,
            delete: false,
          },
          columns: {
            // id: {
            //   title: 'ID',
            //   type: 'string',
            // },
            bin: {
              title: 'BIN',
              type: 'string',
            },
            type: {
              title: 'Тип',
              type: 'string',
            },
            name_eng: {
              title: 'Назва банку англійською',
              type: 'string',
            },
            name_uk: {
              title: 'Назва банку українською',
              type: 'string',
            },
            name_rus: {
              title: 'Назва банку російською',
              type: 'string',
            },
            operator_name: {
              title: 'Операційне ім’я ',
              type: 'string',
            },
            contact_person: {
              title: 'Контактна особа',
              type: 'string',
            },
            contact_telephone: {
              title: 'Контактний телефон',
              type: 'string',
            },
            contact_email: {
              title: 'Контактна пошта',
              type: 'string',
            },
          },
        };
      }
      break;
      default: {
        this.settings = {
          actions:{
            add: false,
            edit: false,
            delete: false,
          },
        };
      }
    }
  }

  getBanksData() {
    this.banksData = new Array<Bank>();

    let self = this;
    let pageSize = 0;
    let pageNumber = 0;
    this.banksSubscription = this.httpServise.getBankList(pageSize, pageNumber).subscribe({
      next: (response: any) => {
        let data: any;

        if(pageSize > 0 && pageNumber > 0)
          data = response.results;
        else
          data = response;

        data.forEach(el => {
          let t = new Bank();
    
          t.id = el['id'];
          t.bin = el['bin'];
          t.type = el['type'];
          t.name_eng = el['name_eng'];
          t.name_uk = el['name_uk'];
          t.name_rus = el['name_rus'];
          t.operator_name = el['operator_name'];
          t.contact_person = el['contact_person'];
          t.contact_telephone = el['contact_telephone'];
          t.contact_email = el['contact_email'];

          self.banksData.push(t);

        });

        self.source = new LocalDataSource();
        self.source.load(self.banksData);
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
      }
    });
  }

  ngOnDestroy(): void {
    this.banksSubscription.unsubscribe();
  }
}
