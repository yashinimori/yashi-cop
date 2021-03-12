import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsInfoComponent } from './transactions-info.component';

describe('TransactionsInfoComponent', () => {
  let component: TransactionsInfoComponent;
  let fixture: ComponentFixture<TransactionsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
