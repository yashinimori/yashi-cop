import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsiteComponent } from './website.component';
import { RouterModule, Routes } from '@angular/router';
import { AppealsComponent } from './appeals/appeals.component';

const childrens = [
  {path: 'appeals', component: AppealsComponent}
];

export const routes: Routes = [
  {path: '', redirectTo: 'website/appeals', pathMatch: 'full'},
  {path: 'website', redirectTo: 'website/appeals', pathMatch: 'full'},
  {path: 'website', component: WebsiteComponent, children: childrens},
];


@NgModule({
  declarations: [WebsiteComponent, AppealsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class WebsiteModule { }
