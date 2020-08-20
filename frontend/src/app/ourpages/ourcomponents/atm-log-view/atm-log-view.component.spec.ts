import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ATMlogViewerComponent } from './atm-log-view.component';

describe('ATMlogViewerComponent', () => {
  let component: ATMlogViewerComponent;
  let fixture: ComponentFixture<ATMlogViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ATMlogViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ATMlogViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
