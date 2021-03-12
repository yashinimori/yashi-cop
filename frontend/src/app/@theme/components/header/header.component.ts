import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSearchService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { TransferService } from '../../../share/services/transfer.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  role: string;
  user_fio: string;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [ {title: 'Profile', link: '/cop/cabinet/change-user-info', icon: 'person-outline'}, { title: 'Log out', icon: 'unlock-outline'} ];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private layoutService: LayoutService,
              private searchService: NbSearchService,
              private router: Router,
              private transferService: TransferService,
              private breakpointService: NbMediaBreakpointsService) {
  }

  ngOnInit() {
    this.role = localStorage.getItem('role');
    this.user_fio = localStorage.getItem('fio');
    if(!this.user_fio)
      this.user_fio = "no name.";
    
    this.currentTheme = this.themeService.currentTheme;
    this.onSearch();

    // this.userService.getUsers()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((users: any) => this.user = users.nick);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

      //this.user.name = this.user_fio;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  onSearch() {
    this.searchService.onSearchSubmit()
      .subscribe((data: any) => {
        console.log(data);
        this.transferService.searchValue.next(data.term);
        this.router.navigate(['cop', 'cabinet', 'claims', 'all']);
      })
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
