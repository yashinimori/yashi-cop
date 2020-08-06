import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'FEATURES',
    group: true,
  },
  {
    title: 'Layout',
    icon: 'layout-outline',
    children: [
      {
        title: 'Stepper1',
        link: '/ourpages/layout/stepper',
      },
      {
        title: 'List1',
        link: '/ourpages/layout/list',
      },
      {
        title: 'Infinite List1',
        link: '/ourpages/layout/infinite-list',
      },
      {
        title: 'Accordion1',
        link: '/ourpages/layout/accordion',
      },
      {
        title: 'Tabs1',
        pathMatch: 'prefix',
        link: '/ourpages/layout/tabs',
      },
    ],
  },

];
