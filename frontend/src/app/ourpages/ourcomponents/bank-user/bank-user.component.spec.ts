import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankUserComponent } from './bank-user.component';

describe('BankUserComponent', () => {
  let component: BankUserComponent;
  let fixture: ComponentFixture<BankUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
