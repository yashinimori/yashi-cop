import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { OurPagesComponent } from './ourpages.component';
import { OurPagesRoutingModule } from './ourpages-routing.module';

@NgModule({
  imports: [
    OurPagesRoutingModule,
    ThemeModule,
    NbMenuModule,
  ],
  declarations: [
    OurPagesComponent,
  ],
})
export class OurPagesModule {
}
