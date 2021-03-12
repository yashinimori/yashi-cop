import { Component } from '@angular/core';

@Component({
  selector: 'ngx-components',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [`:host {
    height: 100%!important;
  }`]
})
export class OurComponentsComponent {
 
}
