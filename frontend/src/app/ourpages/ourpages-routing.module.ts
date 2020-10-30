import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { OurPagesComponent } from './ourpages.component';

const routes: Routes = [{
  path: '',
  component: OurPagesComponent,
  children: [
    {
       path: 'cabinet',
       loadChildren: () => import('./ourcomponents/ourcomponents.module')
         .then(m => m.OurComponentsModule),
    },
    {
      path: '',
      redirectTo: 'cabinet',
      pathMatch: 'full',
    },
    // {
    //   path: '**',
    //   component: NotFoundComponent,
    // },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OurPagesRoutingModule {
}
