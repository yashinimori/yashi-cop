import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { OurPagesComponent } from './ourpages.component';
import { OurPagesRoutingModule } from './ourpages-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    OurPagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    TranslateModule
  ],
  declarations: [
    OurPagesComponent,
  ],
})
export class OurPagesModule {
}
