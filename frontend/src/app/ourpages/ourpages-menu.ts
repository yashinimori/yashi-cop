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
    title: 'Наші компоненти (cbo)',
    icon: 'layout-outline',
    hidden: setHiddenChargebackOfficer(),
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
    title: 'Наші компоненти (mc)',
    icon: 'layout-outline',
    hidden: setHiddenMerchant(),
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
    title: 'Messages',
    icon: 'email-outline',
  },
  {
    title: 'Settings',
    
  },
  
];

function setHiddenUser(){
  let role= localStorage.getItem('role');
  console.log('setHidden() ' + role);

  if(role && (role=='user' || role=='cardholder'))
    return false;

  return true;
}

function setHiddenAdmin(){
  let role= localStorage.getItem('role');
  console.log('setHiddenAdmin() ' + role);

  if(role && (role=='admin'))
    return false;

  return true;
}

function setHiddenChargebackOfficer(){
  let role= localStorage.getItem('role');
  console.log('setHiddenChargebackOfficer() ' + role);

  if(role && (role=='chargeback_officer'))
    return false;

  return true;
}

function setHiddenMerchant(){
  let role= localStorage.getItem('role');
  console.log('setHiddenMerchant() ' + role);

  if(role && (role=='merchant'))
    return false;

  return true;
}
