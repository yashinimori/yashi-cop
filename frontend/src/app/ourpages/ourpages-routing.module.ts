import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { OurPagesComponent } from './ourpages.component';

const routes: Routes = [{
  path: '',
  component: OurPagesComponent,
  children: [
    {
       path: 'ourcomponents',
       loadChildren: () => import('./ourcomponents/ourcomponents.module')
         .then(m => m.OurComponentsModule),
    },
    {
      path: 'layout',
      loadChildren: () => import('./layout/layout.module')
        .then(m => m.LayoutModule),
    },
    {
      path: '',
      redirectTo: 'OurComponents',
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