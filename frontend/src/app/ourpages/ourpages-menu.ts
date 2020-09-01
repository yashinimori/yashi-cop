import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Мої зверненя',
    icon: 'layout-outline',
    hidden: setHiddenUser(),
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
    hidden: setHiddenAdmin(),
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
    hidden: setHiddenChargebackOfficer(),
    link: '/ourpages/ourcomponents/chbo-dashboard'
  },
  {
    title: 'Disputes',
    icon: 'layout-outline',
    hidden: setHiddenChargebackOfficer(),
    link: '/ourpages/ourcomponents/claims'
  },
  {
    title: 'ATM manage (cbo)',
    icon: 'layout-outline',
    hidden: setHiddenChargebackOfficer(),
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
    hidden: setHiddenChargebackOfficer(),
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
        link: '/ourpages/ourcomponents/chbo-my-claims/chargebacks',
      },
      {
        title: 'archive',
        icon: 'radio-button-off-outline',
        link: '/ourpages/ourcomponents/chbo-my-claims/archive',
      },
    ],
  },
  {
    title: 'Претензії',
    icon: 'layout-outline',
    hidden: setHiddenMerchant(),
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
    hidden: setHiddenBank(),
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
    hidden: setHiddenTopOfficer(),
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
    hidden: setHiddenSecurOfficer(),
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
    hidden: setHiddenStatistic(),
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
    hidden: setHiddenMessages(),
  },
  {
    title: 'Settings',
    hidden: setHiddenSettings(),
  },
  
];

function setHiddenUser(){
  let role= localStorage.getItem('role');
  //console.log('setHidden() ' + role);

  if(role && (role=='user' || role =='cc_branch' || role=='cardholder'))
    return false;

  return true;
}

function setHiddenAdmin(){
  let role= localStorage.getItem('role');
  //console.log('setHiddenAdmin() ' + role);

  if(role && (role=='admin'))
    return false;

  return true;
}

function setHiddenCOPManager(){
  let role= localStorage.getItem('role');
  //console.log('setHiddenAdmin() ' + role);

  if(role && (role=='cop_manager'))
    return false;

  return true;
}

function setHiddenChargebackOfficer(){
  let role= localStorage.getItem('role');
  //console.log('setHiddenChargebackOfficer() ' + role);

  if(role && (role=='chargeback_officer'))
    return false;

  return true;
}

function setHiddenMerchant(){
  let role= localStorage.getItem('role');
  //console.log('setHiddenMerchant() ' + role);

  if(role && (role=='merchant'))
    return false;

  return true;
}

function setHiddenBank(){
  let role= localStorage.getItem('role');
  //console.log('setHiddenBank() ' + role);

  if(role && (role=='cop_manager'))
    return false;

  return true;
}

function setHiddenTopOfficer(){
  let role= localStorage.getItem('role');
  //console.log('setHiddenTopOfficer() ' + role);

  if(role && (role=='top_level'))
    return false;

  return true;
}


function setHiddenSecurOfficer(){
  let role= localStorage.getItem('role');
  // console.log('setHiddenSecurOfficer() ' + role);

  if(role && (role=='security_officer'))
    return false;

  return true;
}


function setHiddenMessages(){

  let role= localStorage.getItem('role');
  //console.log('setHiddenMessages() ' + role);

  if(role && (role=='cop_manager'))
    return false;

  return true;
}

function setHiddenSettings(){

  let role= localStorage.getItem('role');
  //console.log('setHiddenMessages() ' + role);

  if(role && (role=='cop_manager'))
    return false;

  return true;
}

function setHiddenStatistic(){
  let role= localStorage.getItem('role');
  //console.log('setHiddenStatistic() ' + role);

  if(role && (role=='cop_manager' || role=='top_level') )
    return false;

  return true;
}

