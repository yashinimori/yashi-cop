import { Component, OnInit } from '@angular/core';

//import { MENU_ITEMS } from './ourpages-menu';
import { Compiler } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';


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
export class OurPagesComponent implements OnInit {

  //menu = MENU_ITEMS;
  menu: any;
  
  constructor(private compiler: Compiler, private translate: TranslateService){
    if(localStorage.getItem('selectedLang')) {
      this.translate.use(localStorage.getItem('selectedLang'));
    } else {
      this.translate.use(this.translate.defaultLang);
    }
  }
  ngOnInit(): void {
    this.compiler.clearCache();
    this.menu = this.getMenu();
    this.translateMenu();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => { //Live reload
      this.translateMenu();
  });
  }

  private translateMenu(): void {
    this.menu.forEach((menuItem: any) => {
        this.translateMenuTitle(menuItem);
    });
}

/**
 * Translates one root menu item and every nested children
 * @param menuItem
 * @param prefix
 */
private translateMenuTitle(menuItem: any, prefix: string = ''): void {
    let key = '';
    try {
        key = (prefix !== '')
            ? OurPagesComponent.getMenuItemKey(menuItem, prefix)
            : OurPagesComponent.getMenuItemKey(menuItem);
    }
    catch (e) {
        //Key not found, don't change the menu item
        return;
    }

    this.translate.get(key).subscribe((translation: string) => {
        menuItem.title = translation;
    });
    if (menuItem.children != null) {
        //apply same on every child
        menuItem.children.forEach((childMenuItem: any) => {
            //We remove the nested key and then use it as prefix for every child
            this.translateMenuTitle(childMenuItem);
        });
    }
}

/**
 * Resolves the translation key for a menu item. The prefix must be supplied for every child menu item
 * @param menuItem
 * @param prefix
 * @returns {string}
 */
private static getMenuItemKey(menuItem: any, prefix: string = 'menu'): string {
    if (menuItem.key == null) {
        throw new Error('Key not found');
    }

    const key = menuItem.key.toLowerCase();
    // if (menuItem.children != null) {
    //     return prefix + '.' + key + '.' + key; //Translation is nested
    // }
    return prefix + '.' + key;
}

/**
 * Used to remove the nested key for translations
 * @param key
 * @returns {string}
 */
private static trimLastSelector(key: string): string {
    const keyParts = key.split('.');
    //console.log(key)
    //keyParts.pop();
    //return keyParts.join('.');
    return keyParts[keyParts.length - 1];
}

  getMenu(){
    let m: any[] = [
      {
        title: this.translate.instant('menu.claims_list'), 
        icon: 'layout-outline',
        link: '/cop/cabinet/claims/all',
        key: "claims_list",
        hidden: this.setHiddenUser(),
      },
      {
        title: this.translate.instant('menu.archive'),
        icon: 'inbox-outline',
        link: '/cop/cabinet/claims/archive',
        key: "archive",
        hidden: this.setHiddenUser(),
      },
      {
        title: this.translate.get('menu.claims_list'),
        icon: 'layout-outline',
        key: "claims_list",
        link: '/cop/cabinet/claims',
        hidden: this.setHiddenAdmin(),
      },
      {
        title: this.translate.get('menu.dashboard'),
        icon: 'layout-outline',
        key: "dashboard",
        hidden: this.setHiddenChargebackOfficer(),
        link: '/cop/cabinet/chbo-dashboard'
      },
      {
        title: this.translate.get('menu.disputes'),
        icon: 'layout-outline',
        key: "disputes",
        hidden: this.setHiddenChargebackOfficer(),
        link: '/cop/cabinet/claims'
      },
      {
        title: this.translate.get('menu.atm_managment'),
        icon: 'layout-outline',
        key: "atm_managment",
        hidden: this.setHiddenChargebackOfficer(),
        children: [
          {
            title: this.translate.get('menu.atm_new'),
            link: '/cop/cabinet/atm-log-upload',
            key: "atm_new",
            icon: 'file-add-outline'
          },
          {
            title: this.translate.get('menu.atm_log'),
            link: '/cop/cabinet/atm-log-view',
            key: "atm_log",
            icon: 'file-outline'
          },
          {
            title: this.translate.get('menu.atm_detail'),
            link: '/cop/cabinet/atm-log-view-detail',
            key: "atm_detail",
            icon: 'file-text-outline'
          },
        ],
      },
      {
        title: this.translate.get('menu.my_cases'),
        key: "my_cases",
        icon: 'person-outline',
        hidden: this.setHiddenChargebackOfficer(),
        children: [
          {
            title: this.translate.get('menu.my_cases_pre_mediation'),
            key: "my_cases_pre_mediation",
            icon: 'book-open-outline',
            link: '/cop/cabinet/chbo-my-claims/pre_mediation',
          },
          {
            title: this.translate.get('menu.my_cases_mediation'),
            key: "my_cases_mediation",
            icon: 'book-outline',
            link: '/cop/cabinet/chbo-my-claims/mediation',
          },
          {
            title: this.translate.get('menu.my_cases_chargebacks'),
            key: "my_cases_chargebacks",
            icon: 'archive-outline',
            link: '/cop/cabinet/chbo-my-claims/chargeback',
          },
          {
            title: this.translate.get('menu.my_cases_archive'),
            key: "my_cases_archive",
            icon: 'inbox-outline',
            link: '/cop/cabinet/chbo-my-claims/closed',
          },
          {
            title: this.translate.get('menu.my_cases_merchant_requests'),
            icon: 'file-text-outline',
            key: "my_cases_merchant_requests",
            link: '/cop/cabinet/chbo-merchant-requests',
          },
          {
            title: this.translate.get('menu.my_cases_tasks'),
            icon: 'file-text-outline',
            key: "my_cases_tasks",
            link: '/cop/cabinet/chbo-tasks',
          },
        ],
      },
      {
        title: this.translate.get('menu.mastercard'),
        key: "mastercard",
        icon: 'credit-card-outline',
        hidden: this.setHiddenChargebackOfficer(),
        children: [
          {
            title: this.translate.get('menu.mastercard_transaction_search'),
            link: '/cop/cabinet/mastercard-transaction-search',
            key: "mastercard_transaction_search",
            icon: 'cast-outline'
          },
          {
            title: this.translate.get('menu.mastercard_chargebacks'),
            link: '/cop/cabinet/mastercard-chargebacks',
            key: "mastercard_chargebacks",
            icon: 'book-open-outline'
          },
          {
            title: this.translate.get('menu.mastercard_retrieval'),
            link: '/cop/cabinet/mastercard-retrieval',
            key: "mastercard_retrieval",
            icon: 'book-open-outline'
          },
          {
            title: this.translate.get('menu.mastercard_fees'),
            link: '/cop/cabinet/mastercard-fees',
            key: "mastercard_fees",
            icon: 'book-open-outline'
          }
        ],
      },
      {
        title: this.translate.get('menu.appeals'),
        icon: 'layout-outline',
        key: "appeals",
        hidden: this.setHiddenMerchant(),
        link: '/cop/cabinet/claims/all',
      },
      {
        title: this.translate.get('menu.closed'),
        icon: 'inbox-outline',
        key: "closed",
        hidden: this.setHiddenMerchant(),
        link: '/cop/cabinet/claims/archive',
      },
      {
        title: this.translate.get('menu.transactions'),
        icon: 'file-text',
        key: "transactions",
        hidden: this.setHiddenMerchant(),
        link: '/cop/cabinet/transactions',
      },
      {
        title: this.translate.get('menu.bank_list'),
        icon: 'layout-outline',
        key: "bank_list",
        link: '/cop/cabinet/bank-list',
        hidden: this.setHiddenBank(),
      },
      {
        title: this.translate.get('menu.new_bank'),
        icon: 'plus-outline',
        key: "new_bank",
        link: '/cop/cabinet/bank',
        hidden: this.setHiddenBank(),
      },
      {
        title: this.translate.get('menu.users'),
        icon: 'person-outline',
        key: "users",
        link: '/cop/cabinet/top-officer/users',
        hidden: this.setHiddenTopOfficer(),
      },
      {
        title: this.translate.get('menu.merchants'),
        icon: 'people-outline',
        key: "merchants",
        link: '/cop/cabinet/top-officer/merchants',
        hidden: this.setHiddenTopOfficer(),
      },
      {
        title: this.translate.get('menu.bank_statistic'),
        icon: 'bar-chart-outline',
        key: "bank_statistic",
        link: '/cop/cabinet/bank-statistic',
        hidden: this.setHiddenTopOfficer(),
      },
      {
        title: this.translate.get('menu.bank_accounts'),
        icon: 'credit-card-outline',
        key: "bank_accounts",
        link: '/cop/cabinet/bank-accounts',
        hidden: this.setHiddenTopOfficer(),
      },
      {
        title: this.translate.get('menu.secur_officer'),
        icon: 'person-outline',
        key: "secur_officer",
        link: '/cop/cabinet/secur-officer',
        hidden: this.setHiddenSecurOfficer(),
      },
      {
        title: this.translate.get('menu.statistic'),
        icon: 'bar-chart-outline',
        key: "statistic",
        link: '/cop/cabinet/statistic',
        hidden: this.setHiddenStatistic(),
      },  
      {
        title: this.translate.get('menu.bank_accounts_chb'),
        icon: 'credit-card-outline',
        key: "bank_accounts_chb",
        link: '/cop/cabinet/bank-accounts',
        hidden: this.setHiddenChargebackOfficer(),
      },
      {
        title: this.translate.get('menu.tutorials'),
        icon: 'book-outline',
        key: "tutorials",
        link: '/cop/cabinet/tutorials',
        hidden: this.setHiddenTutorial(),
      },      
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
