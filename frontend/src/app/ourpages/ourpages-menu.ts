import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Наші компоненти (ch)',
    icon: 'layout-outline',
    hidden: setHiddenUser(),
    children: [
      {
        title: 'список скарг',
        link: '/ourpages/ourcomponents/claims',
      },
      {
        title: 'скарга',
        link: '/ourpages/ourcomponents/single-claim',
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
      {
        title: 'скарга',
        link: '/ourpages/ourcomponents/single-claim',
      },
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
  },
  {
    title: 'ATM Management',
    icon: 'layout-outline',
    hidden: setHiddenChargebackOfficer(),
  },
  {
    title: 'My Claims',
    icon: 'person-outline',
    hidden: setHiddenChargebackOfficer(),
    children: [
      {
        title: 'pre-mediation',
        icon: 'radio-button-off-outline',
        link: '/ourpages/ourcomponents/chbo-my-claims',
      },
      {
        title: 'mediation',
        icon: 'radio-button-off-outline',
        link: '#',
      },
      {
        title: 'chargebacks',
        icon: 'radio-button-off-outline',
        link: '#',
      },
      {
        title: 'archive',
        icon: 'radio-button-off-outline',
        link: '#',
      },
    ],
  },
  // {
  //   title: 'ATM manage (cbo)',
  //   icon: 'layout-outline',
  //   hidden: setHiddenChargebackOfficer(),
  //   children: [
  //     {
  //       title: 'ATM лог - новий',
  //       link: '/ourpages/ourcomponents/atm-log-upload',
  //     },
  //     {
  //       title: 'ATM лог - перегляд',
  //       link: '/ourpages/ourcomponents/atm-log-view',
  //     },
  //     {
  //       title: 'ATM лог - детальний',
  //       link: '/ourpages/ourcomponents/atm-log-view-detail',
  //     },
  //   ],
  // },
  {
    title: 'Наші компоненти (mc)',
    icon: 'layout-outline',
    hidden: setHiddenMerchant(),
    children: [
      {
        title: 'список скарг',
        link: '/ourpages/ourcomponents/claims',
      },
      
    ],
  },
  {
    title: 'БАНК',
    icon: 'layout-outline',
    //hidden: setHiddenMerchant(),
    children: [
      {
        title: 'Новий bank',
        link: '/ourpages/ourcomponents/bank',
      },
      {
        title: 'Новий користувач',
        link: '/ourpages/ourcomponents/bank-user',
      },
    ],
  },
  {
    title: 'МЕРЧАНТ',
    icon: 'layout-outline',
    //hidden: setHiddenMerchant(),
    children: [
      {
        title: 'Новий мерчант',
        link: '/ourpages/ourcomponents/merch-user',
      },
    ],
  },
  {
    title: 'Messages',
    icon: 'email-outline',
  },
  {
    title: 'Settings',
    
  },
  
];

function setHiddenUser(){
  let role= localStorage.getItem('role');
  //console.log('setHidden() ' + role);

  if(role && (role=='user' || role=='cardholder'))
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
