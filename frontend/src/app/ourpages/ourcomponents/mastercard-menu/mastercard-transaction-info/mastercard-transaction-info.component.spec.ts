import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MastercardTransactionInfoComponent } from './mastercard-transaction-info.component';

describe('MastercardTransactionInfoComponent', () => {
  let component: MastercardTransactionInfoComponent;
  let fixture: ComponentFixture<MastercardTransactionInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MastercardTransactionInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MastercardTransactionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
