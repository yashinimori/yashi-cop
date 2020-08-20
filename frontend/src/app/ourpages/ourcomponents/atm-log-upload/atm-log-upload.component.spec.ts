import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ATMlogUploadComponent } from './atm-log-upload.component';

describe('ATMlogUploadComponent', () => {
  let component: ATMlogUploadComponent;
  let fixture: ComponentFixture<ATMlogUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ATMlogUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ATMlogUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
