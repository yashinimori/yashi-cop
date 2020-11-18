import { Component } from '@angular/core';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout windowMode>
      <nb-layout-header fixed style="height: 3.75rem;">
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive style="top:3.75rem;">
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column style="padding:0.5em;">
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent {}

// <nb-layout-footer fixed>
//         <ngx-footer></ngx-footer>
//       </nb-layout-footer>