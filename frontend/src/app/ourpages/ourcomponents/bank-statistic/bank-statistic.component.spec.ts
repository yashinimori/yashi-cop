import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankStatisticComponent } from './bank-statistic.component';

describe('BankStatisticComponent', () => {
  let component: BankStatisticComponent;
  let fixture: ComponentFixture<BankStatisticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankStatisticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
