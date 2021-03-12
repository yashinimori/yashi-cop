import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MastercardChargebacksComponent } from './mastercard-chargebacks.component';

describe('MastercardChargebacksComponent', () => {
  let component: MastercardChargebacksComponent;
  let fixture: ComponentFixture<MastercardChargebacksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MastercardChargebacksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MastercardChargebacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
