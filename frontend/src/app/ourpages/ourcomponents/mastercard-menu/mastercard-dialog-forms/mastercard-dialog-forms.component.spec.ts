import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MastercardDialogFormsComponent } from './mastercard-dialog-forms.component';

describe('MastercardDialogFormsComponent', () => {
  let component: MastercardDialogFormsComponent;
  let fixture: ComponentFixture<MastercardDialogFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MastercardDialogFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MastercardDialogFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
