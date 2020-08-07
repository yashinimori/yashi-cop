import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Наші компоненти',
    icon: 'layout-outline',
    children: [
      {
        title: 'скарга',
        link: '/ourpages/ourcomponents/claims',
      },
      {
        title: 'список скарг',
        link: '/ourpages/ourcomponents/single-claim',
      },
          
    ],
  },
  {
    title: 'Layout',
    icon: 'layout-outline',
    children: [
      {
        title: 'Accordion1',
        link: '/ourpages/layout/accordion',
      },
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
        title: 'Tabs1',
        pathMatch: 'prefix',
        link: '/ourpages/layout/tabs',
      },
    ],
  },

];
