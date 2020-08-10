import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Наші компоненти',
    icon: 'layout-outline',
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
    title: 'TEST',
    icon: 'layout-outline',
    hidden: true,
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
];
