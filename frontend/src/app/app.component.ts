/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { SeoService } from './@core/utils/seo.service';
import { NbMenuService } from '@nebular/theme';
import { Router } from '@angular/router';


@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  
  constructor(private router: Router,
    private menuService: NbMenuService,
    private analytics: AnalyticsService, 
    private seoService: SeoService) {
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();

    this.menuService.onItemClick()
      .subscribe((event) => {
        this.onContecxtItemSelection(event.item.title);
      });
  }

  onContecxtItemSelection(title) {
    console.log('click', title);

    if(title == 'Log out'){
      localStorage.clear();
      this.router.navigate(['auth', 'login']);
    }
  }
}
