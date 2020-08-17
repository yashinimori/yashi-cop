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
    title: 'Наші компоненти (oo)',
    icon: 'layout-outline',
    hidden: setHiddenOfficeOfficer(),
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
  console.log('setHidden() ' + role);

  if(role && (role=='admin'))
    return false;

  return true;
}

function setHiddenOfficeOfficer(){
  let role= localStorage.getItem('role');
  console.log('setHidden() ' + role);

  if(role && (role=='chargeback_officer'))
    return false;

  return true;
}
