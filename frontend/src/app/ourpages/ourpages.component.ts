import { Component } from '@angular/core';

import { MENU_ITEMS } from './ourpages-menu';
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
    console.log('export class OurPagesComponent');
    this.compiler.clearCache();
    this.menu = this.getMenu();
  }

  getMenu(){
    let m: NbMenuItem[] = [
      {
        title: 'Мої зверненя',
        icon: 'layout-outline',
        hidden: this.setHiddenUser(),
        children: [
          {
            title: 'список скарг',
            link: '/ourpages/ourcomponents/claims/all',
          },
          {
             title: 'завершені',
             link: '/ourpages/ourcomponents/claims/archive',
           },
        ],
      },
      {
        title: 'Наші компоненти (am)',
        icon: 'layout-outline',
        hidden: this.setHiddenAdmin(),
        children: [
          {
            title: 'список скарг',
            link: '/ourpages/ourcomponents/claims',
          },
          // {
          //   title: 'скарга',
          //   link: '/ourpages/ourcomponents/single-claim',
          // },
        ],
      },
      {
        title: 'Dashboard',
        icon: 'layout-outline',
        hidden: this.setHiddenChargebackOfficer(),
        link: '/ourpages/ourcomponents/chbo-dashboard'
      },
      {
        title: 'Disputes',
        icon: 'layout-outline',
        hidden: this.setHiddenChargebackOfficer(),
        link: '/ourpages/ourcomponents/claims'
      },
      {
        title: 'ATM manage (cbo)',
        icon: 'layout-outline',
        hidden: this.setHiddenChargebackOfficer(),
        children: [
          {
            title: 'ATM лог - новий',
            link: '/ourpages/ourcomponents/atm-log-upload',
          },
          {
            title: 'ATM лог - перегляд',
            link: '/ourpages/ourcomponents/atm-log-view',
          },
          {
            title: 'ATM лог - детальний',
            link: '/ourpages/ourcomponents/atm-log-view-detail',
          },
        ],
      },
      {
        title: 'My Claims',
        icon: 'person-outline',
        hidden: this.setHiddenChargebackOfficer(),
        children: [
          {
            title: 'pre-mediation',
            icon: 'radio-button-off-outline',
            link: '/ourpages/ourcomponents/chbo-my-claims/pre_mediation',
          },
          {
            title: 'mediation',
            icon: 'radio-button-off-outline',
            link: '/ourpages/ourcomponents/chbo-my-claims/mediation',
          },
          {
            title: 'chargebacks',
            icon: 'radio-button-off-outline',
            link: '/ourpages/ourcomponents/chbo-my-claims/chargeback',
          },
          {
            title: 'archive',
            icon: 'radio-button-off-outline',
            link: '/ourpages/ourcomponents/chbo-my-claims/closed',
          },
        ],
      },
      {
        title: 'Претензії',
        icon: 'layout-outline',
        hidden: this.setHiddenMerchant(),
        children: [
          {
            title: 'зверненя',
            link: '/ourpages/ourcomponents/claims/all',
          },
          {
            title: 'завершені',
            link: '/ourpages/ourcomponents/claims/archive',
         },
        ],
      },
      {
        title: 'БАНК',
        icon: 'layout-outline',
        hidden: this.setHiddenBank(),
        children: [
          {
            title: 'Список банків',
            link: '/ourpages/ourcomponents/bank-list',
          },
          {
            title: 'Новий банк',
            link: '/ourpages/ourcomponents/bank',
          },
          // {
          //   title: 'Новий користувач',
          //   link: '/ourpages/ourcomponents/bank-user',
          // },
        ],
      },
      // {
      //   title: 'МЕРЧАНТ',
      //   icon: 'layout-outline',
      //   hidden: setHiddenCOPManager(),
      //   children: [
      //     {
      //       title: 'Новий мерчант',
      //       link: '/ourpages/ourcomponents/merch-user',
      //     },
      //   ],
      // },
      {
        title: 'Користувачи',
        icon: 'layout-outline',
        hidden: this.setHiddenTopOfficer(),
        children: [
          {
            title: 'Користувачи',
            link: '/ourpages/ourcomponents/top-officer',
          },
          // {
          //   title: 'Новий bank',
          //   link: '/ourpages/ourcomponents/bank',
          // },
          // {
          //   title: 'Новий користувач',
          //   link: '/ourpages/ourcomponents/bank-user',
          // },
        ],
      },
      {
        title: 'Користувачи',
        icon: 'layout-outline',
        hidden: this.setHiddenSecurOfficer(),
        children: [
          {
            title: 'Користувачи',
            link: '/ourpages/ourcomponents/secur-officer',
          },
          // {
          //   title: 'Новий bank',
          //   link: '/ourpages/ourcomponents/bank',
          // },
          // {
          //   title: 'Новий користувач',
          //   link: '/ourpages/ourcomponents/bank-user',
          // },
        ],
      },
      {
        title: 'Статистика',
        icon: 'layout-outline',
        hidden: this.setHiddenStatistic(),
        children: [
          {
            title: 'Статистика',
            link: '/ourpages/ourcomponents/statistic',
          },
        ],
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
    console.log('function setHiddenUser()');
    
    let role= localStorage.getItem('role');
    if(role && (role=='user' || role =='cc_branch' || role=='cardholder'))
      return false;
  
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