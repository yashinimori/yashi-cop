import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurOfficerUserComponent } from './secur-officer-user.component';

describe('SecurOfficerUserComponent', () => {
  let component: SecurOfficerUserComponent;
  let fixture: ComponentFixture<SecurOfficerUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurOfficerUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurOfficerUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
