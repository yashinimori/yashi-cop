import { Component } from '@angular/core';

import { MENU_ITEMS } from './ourpages-menu';

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

  menu = MENU_ITEMS;
}
