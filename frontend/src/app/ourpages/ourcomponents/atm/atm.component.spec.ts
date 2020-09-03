import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchUserComponent } from './merch-user.component';

describe('MerchUserComponent', () => {
  let component: MerchUserComponent;
  let fixture: ComponentFixture<MerchUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
