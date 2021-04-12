import { Component } from '@angular/core';

//import { MENU_ITEMS } from './ourpages-menu';
import { Compiler } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'ngx-ourpages',
  styleUrls: ['ourpages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class OurPagesComponent {

  //menu = MENU_ITEMS;
  menu: any;
  
  constructor(private compiler: Compiler){
    this.compiler.clearCache();
    this.menu = this.getMenu();
  }

  getMenu(){
    let m: NbMenuItem[] = [
      {
        title: 'Список скарг',
        icon: 'layout-outline',
        link: '/cop/cabinet/claims/all',
        hidden: this.setHiddenUser(),
      },
      {
        title: 'Завершені',
        icon: 'inbox-outline',
        link: '/cop/cabinet/claims/archive',
        hidden: this.setHiddenUser(),
      },
      {
        title: 'Список скарг',
        icon: 'layout-outline',
        link: '/cop/cabinet/claims',
        hidden: this.setHiddenAdmin(),
      },
      {
        title: 'Dashboard',
        icon: 'layout-outline',
        hidden: this.setHiddenChargebackOfficer(),
        link: '/cop/cabinet/chbo-dashboard'
      },
      {
        title: 'Disputes',
        icon: 'layout-outline',
        hidden: this.setHiddenChargebackOfficer(),
        link: '/cop/cabinet/claims'
      },
      {
        title: 'ATM Management',
        icon: 'layout-outline',
        hidden: this.setHiddenChargebackOfficer(),
        children: [
          {
            title: 'ATM лог - новий',
            link: '/cop/cabinet/atm-log-upload',
            icon: 'file-add-outline'
          },
          {
            title: 'ATM лог - перегляд',
            link: '/cop/cabinet/atm-log-view',
            icon: 'file-outline'
          },
          {
            title: 'ATM лог - детальний',
            link: '/cop/cabinet/atm-log-view-detail',
            icon: 'file-text-outline'
          },
        ],
      },
      {
        title: 'My Cases',
        icon: 'person-outline',
        hidden: this.setHiddenChargebackOfficer(),
        children: [
          {
            title: 'pre-mediation',
            icon: 'book-open-outline',
            link: '/cop/cabinet/chbo-my-claims/pre_mediation',
          },
          {
            title: 'mediation',
            icon: 'book-outline',
            link: '/cop/cabinet/chbo-my-claims/mediation',
          },
          {
            title: 'chargebacks',
            icon: 'archive-outline',
            link: '/cop/cabinet/chbo-my-claims/chargeback',
          },
          {
            title: 'archive',
            icon: 'inbox-outline',
            link: '/cop/cabinet/chbo-my-claims/closed',
          },
          {
            title: 'Merchant requests',
            icon: 'file-text-outline',
            link: '/cop/cabinet/chbo-merchant-requests',
          },
          {
            title: 'Tasks',
            icon: 'file-text-outline',
            link: '/cop/cabinet/chbo-tasks',
          },
        ],
      },
      {
        title: 'Mastercard',
        icon: 'credit-card-outline',
        hidden: this.setHiddenChargebackOfficer(),
        children: [
          {
            title: 'Transaction Search',
            link: '/cop/cabinet/mastercard-transaction-search',
            icon: 'cast-outline'
          },
          {
            title: 'Chargebacks',
            link: '/cop/cabinet/mastercard-chargebacks',
            icon: 'book-open-outline'
          },
          {
            title: 'Retrieval',
            link: '/cop/cabinet/mastercard-retrieval',
            icon: 'book-open-outline'
          },
          {
            title: 'Fees',
            link: '/cop/cabinet/mastercard-fees',
            icon: 'book-open-outline'
          }
        ],
      },
      // {
      //   title: 'Dashboard',
      //   icon: 'layout-outline',
      //   hidden: this.setHiddenChargebackOfficer(),
      //   link: '/cop/cabinet/chbo-dashboard'
      // },
      // {
      //   title: 'Disputes',
      //   icon: 'layout-outline',
      //   hidden: this.setHiddenChargebackOfficer(),
      //   link: '/cop/cabinet/claims'
      // },
      // {
      //   title: 'ATM лог - новий',
      //   icon: 'file-add-outline',
      //   link: '/cop/cabinet/atm-log-upload',
      //   hidden: this.setHiddenChargebackOfficer(),
      // },
      // {
      //   title: 'ATM лог - перегляд',
      //   icon: 'file-outline',
      //   link: '/cop/cabinet/atm-log-view',
      //   hidden: this.setHiddenChargebackOfficer(),
      // },
      // {
      //   title: 'ATM лог - детальний',
      //   icon: 'file-text-outline',
      //   link: '/cop/cabinet/atm-log-view-detail',
      //   hidden: this.setHiddenChargebackOfficer(),
      // },
      // {
      //   title: 'pre-mediation claims',
      //   icon: 'book-open-outline',
      //   link: '/cop/cabinet/chbo-my-claims/pre_mediation',
      //   hidden: this.setHiddenChargebackOfficer(),
      // },
      // {
      //   title: 'mediation claims',
      //   icon: 'book-outline',
      //   link: '/cop/cabinet/chbo-my-claims/mediation',
      //   hidden: this.setHiddenChargebackOfficer(),
      // },
      // {
      //   title: 'chargebacks claims',
      //   icon: 'archive-outline',
      //   link: '/cop/cabinet/chbo-my-claims/chargeback',
      //   hidden: this.setHiddenChargebackOfficer(),
      // },
      // {
      //   title: 'archive claims',
      //   icon: 'inbox-outline',
      //   link: '/cop/cabinet/chbo-my-claims/closed',
      //   hidden: this.setHiddenChargebackOfficer(),
      // },
      {
        title: 'Звернення',
        icon: 'layout-outline',
        hidden: this.setHiddenMerchant(),
        link: '/cop/cabinet/claims/all',
      },
      {
        title: 'Завершені',
        icon: 'inbox-outline',
        hidden: this.setHiddenMerchant(),
        link: '/cop/cabinet/claims/archive',
      },
      {
        title: 'Transactions',
        icon: 'file-text',
        hidden: this.setHiddenMerchant(),
        link: '/cop/cabinet/transactions',
      },
      {
        title: 'Список банків',
        icon: 'layout-outline',
        link: '/cop/cabinet/bank-list',
        hidden: this.setHiddenBank(),
      },
      {
        title: 'Новий банк',
        icon: 'plus-outline',
        link: '/cop/cabinet/bank',
        hidden: this.setHiddenBank(),
      },
      {
        title: 'Користувачі',
        icon: 'person-outline',
        link: '/cop/cabinet/top-officer/users',
        hidden: this.setHiddenTopOfficer(),
      },
      {
        title: 'Мерчанти',
        icon: 'people-outline',
        link: '/cop/cabinet/top-officer/merchants',
        hidden: this.setHiddenTopOfficer(),
      },
      {
        title: 'Статистика',
        icon: 'bar-chart-outline',
        link: '/cop/cabinet/bank-statistic',
        hidden: this.setHiddenTopOfficer(),
      },
      {
        title: 'Рахунки',
        icon: 'credit-card-outline',
        link: '/cop/cabinet/bank-accounts',
        hidden: this.setHiddenTopOfficer(),
      },
      {
        title: 'Користувачі',
        icon: 'person-outline',
        link: '/cop/cabinet/secur-officer',
        hidden: this.setHiddenSecurOfficer(),
      },
      {
        title: 'Статистика',
        icon: 'bar-chart-outline',
        link: '/cop/cabinet/statistic',
        hidden: this.setHiddenStatistic(),
      },  
      {
        title: 'Рахунки',
        icon: 'credit-card-outline',
        link: '/cop/cabinet/bank-accounts',
        hidden: this.setHiddenChargebackOfficer(),
      },
      {
        title: 'Tutorials',
        icon: 'book-outline',
        link: '/cop/cabinet/tutorials',
        hidden: this.setHiddenTutorial(),
      },
      
      // {
      //   title: 'Messages',
      //   icon: 'email-outline',
      //   hidden: this.setHiddenMessages(),
      // },
      // {
      //   title: 'Settings',
      //   hidden: this.setHiddenSettings(),
      // },
      
    ];
    return m;
  }
   
  setHiddenUser(){    
    let role = localStorage.getItem('role');
    if(role && (role=='user' || role.toString() == 'сс_branch' || role=='cardholder')) {
      return false;
    }  
    return true;
  }
  
  setHiddenAdmin(){
    let role= localStorage.getItem('role');
    if(role && (role=='admin'))
      return false;
  
    return true;
  }
  
  setHiddenCOPManager(){
    let role= localStorage.getItem('role');
    if(role && (role=='cop_manager'))
      return false;
  
    return true;
  }
  
  setHiddenChargebackOfficer(){
    let role= localStorage.getItem('role');
    if(role && (role=='chargeback_officer'))
      return false;
  
    return true;
  }
  
  setHiddenMerchant(){
    let role= localStorage.getItem('role');
    if(role && (role=='merchant'))
      return false;
  
    return true;
  }
  
  setHiddenBank(){
    let role= localStorage.getItem('role');
    if(role && (role=='cop_manager'))
      return false;
  
    return true;
  }
  
  setHiddenTopOfficer(){
    let role= localStorage.getItem('role');
    if(role && (role=='top_level'))
      return false;
  
    return true;
  }
  
  setHiddenSecurOfficer(){
    let role= localStorage.getItem('role');
    if(role && (role=='security_officer'))
      return false;
  
    return true;
  }
  
  setHiddenMessages(){
    let role= localStorage.getItem('role');
    if(role && (role=='cop_manager'))
      return false;
  
    return true;
  }

  setHiddenTutorial() {
    let role= localStorage.getItem('role');
    if(role && (role=='chargeback_officer'))
      return false;
  
    return true;
  }
  
  setHiddenSettings(){
    let role= localStorage.getItem('role');
    if(role && (role=='cop_manager'))
      return false;
  
    return true;
  }
  
  setHiddenStatistic(){
    let role= localStorage.getItem('role');
    if(role && (role=='cop_manager' /* || role=='top_level' */) )
      return false;
  
    return true;
  }

}
