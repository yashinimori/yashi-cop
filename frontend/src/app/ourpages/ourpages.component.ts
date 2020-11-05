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
        link: '/cop/cabinet/top-officer',
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
        title: 'Messages',
        icon: 'email-outline',
        hidden: this.setHiddenMessages(),
      },
      {
        title: 'Settings',
        hidden: this.setHiddenSettings(),
      },
      
    ];
    return m;
  }
   
  setHiddenUser(){    
    let role = localStorage.getItem('role');
    if(role && (role=='user' || role.toString() == 'сс_branch' || role=='cardholder')) {
      console.log('false');
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

// let m: NbMenuItem[] = [
//   {
//     title: 'Мої зверненя',
//     icon: 'layout-outline',
//     hidden: this.setHiddenUser(),
//     children: [
//       {
//         title: 'список скарг',
//         link: '/cop/cabinet/claims/all',
//       },
//       {
//          title: 'завершені',
//          link: '/cop/cabinet/claims/archive',
//        },
//     ],
//   },
//   {
//     title: 'Наші компоненти (am)',
//     icon: 'layout-outline',
//     hidden: this.setHiddenAdmin(),
//     children: [
//       {
//         title: 'список скарг',
//         link: '/cop/cabinet/claims',
//       },
//       // {
//       //   title: 'скарга',
//       //   link: '/ourpages/ourcomponents/single-claim',
//       // },
//     ],
//   },
//   {
//     title: 'Dashboard',
//     icon: 'layout-outline',
//     hidden: this.setHiddenChargebackOfficer(),
//     link: '/cop/cabinet/chbo-dashboard'
//   },
//   {
//     title: 'Disputes',
//     icon: 'layout-outline',
//     hidden: this.setHiddenChargebackOfficer(),
//     link: '/cop/cabinet/claims'
//   },
//   {
//     title: 'ATM manage (cbo)',
//     icon: 'layout-outline',
//     hidden: this.setHiddenChargebackOfficer(),
//     children: [
//       {
//         title: 'ATM лог - новий',
//         link: '/cop/cabinet/atm-log-upload',
//       },
//       {
//         title: 'ATM лог - перегляд',
//         link: '/cop/cabinet/atm-log-view',
//       },
//       {
//         title: 'ATM лог - детальний',
//         link: '/cop/cabinet/atm-log-view-detail',
//       },
//     ],
//   },
//   {
//     title: 'My Claims',
//     icon: 'person-outline',
//     hidden: this.setHiddenChargebackOfficer(),
//     children: [
//       {
//         title: 'pre-mediation',
//         icon: 'radio-button-off-outline',
//         link: '/cop/cabinet/chbo-my-claims/pre_mediation',
//       },
//       {
//         title: 'mediation',
//         icon: 'radio-button-off-outline',
//         link: '/cop/cabinet/chbo-my-claims/mediation',
//       },
//       {
//         title: 'chargebacks',
//         icon: 'radio-button-off-outline',
//         link: '/cop/cabinet/chbo-my-claims/chargeback',
//       },
//       {
//         title: 'archive',
//         icon: 'radio-button-off-outline',
//         link: '/cop/cabinet/chbo-my-claims/closed',
//       },
//     ],
//   },
//   {
//     title: 'Претензії',
//     icon: 'layout-outline',
//     hidden: this.setHiddenMerchant(),
//     children: [
//       {
//         title: 'зверненя',
//         link: '/cop/cabinet/claims/all',
//       },
//       {
//         title: 'завершені',
//         link: '/cop/cabinet/claims/archive',
//      },
//     ],
//   },
//   {
//     title: 'Список банків',
//     icon: 'layout-outline',
//     link: '/cop/cabinet/bank-list',
//     hidden: this.setHiddenBank(),
//   },
//   {
//     title: 'Новий банк',
//     icon: 'layout-outline',
//     link: '/cop/cabinet/bank',
//     hidden: this.setHiddenBank(),
//   },
  
//   // {
//   //   title: 'БАНК',
//   //   icon: 'layout-outline',
//   //   hidden: this.setHiddenBank(),
//   //   children: [
//   //     {
//   //       title: 'Список банків',
//   //       link: '/cop/cabinet/bank-list',
//   //     },
//   //     {
//   //       title: 'Новий банк',
//   //       link: '/cop/cabinet/bank',
//   //     },
//   //     // {
//   //     //   title: 'Новий користувач',
//   //     //   link: '/ourpages/ourcomponents/bank-user',
//   //     // },
//   //   ],
//   // },

//   // {
//   //   title: 'МЕРЧАНТ',
//   //   icon: 'layout-outline',
//   //   hidden: setHiddenCOPManager(),
//   //   children: [
//   //     {
//   //       title: 'Новий мерчант',
//   //       link: '/ourpages/ourcomponents/merch-user',
//   //     },
//   //   ],
//   // },
//   {
//     title: 'Користувачі',
//     icon: 'layout-outline',
//     hidden: this.setHiddenTopOfficer(),
//     children: [
//       {
//         title: 'Користувачі',
//         link: '/cop/cabinet/top-officer',
//       },
//       // {
//       //   title: 'Новий bank',
//       //   link: '/ourpages/ourcomponents/bank',
//       // },
//       // {
//       //   title: 'Новий користувач',
//       //   link: '/ourpages/ourcomponents/bank-user',
//       // },
//     ],
//   },
//   {
//     title: 'Користувачі',
//     icon: 'layout-outline',
//     hidden: this.setHiddenSecurOfficer(),
//     children: [
//       {
//         title: 'Користувачі',
//         link: '/cop/cabinet/secur-officer',
//       },
//       // {
//       //   title: 'Новий bank',
//       //   link: '/ourpages/ourcomponents/bank',
//       // },
//       // {
//       //   title: 'Новий користувач',
//       //   link: '/ourpages/ourcomponents/bank-user',
//       // },
//     ],
//   },
//   {
//     title: 'Статистика',
//     icon: 'layout-outline',
//     hidden: this.setHiddenStatistic(),
//     children: [
//       {
//         title: 'Статистика',
//         link: '/cop/cabinet/statistic',
//       },
//     ],
//   },  

//   {
//     title: 'Messages',
//     icon: 'email-outline',
//     hidden: this.setHiddenMessages(),
//   },
//   {
//     title: 'Settings',
//     hidden: this.setHiddenSettings(),
//   },
  
// ];