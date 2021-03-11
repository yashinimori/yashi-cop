import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MastercardFeesComponent } from './mastercard-fees.component';

describe('MastercardFeesComponent', () => {
  let component: MastercardFeesComponent;
  let fixture: ComponentFixture<MastercardFeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MastercardFeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MastercardFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
