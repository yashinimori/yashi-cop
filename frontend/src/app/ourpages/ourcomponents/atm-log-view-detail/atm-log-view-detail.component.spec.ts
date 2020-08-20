import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ATMlogViewerDetailComponent } from './atm-log-view-detail.component';

describe('ATMlogViewerDetailComponent', () => {
  let component: ATMlogViewerDetailComponent;
  let fixture: ComponentFixture<ATMlogViewerDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ATMlogViewerDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ATMlogViewerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
