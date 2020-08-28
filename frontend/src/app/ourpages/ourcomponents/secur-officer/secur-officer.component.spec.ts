import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurOfficerComponent } from './secur-officer.component';

describe('SecurOfficerComponent', () => {
  let component: SecurOfficerComponent;
  let fixture: ComponentFixture<SecurOfficerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurOfficerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
