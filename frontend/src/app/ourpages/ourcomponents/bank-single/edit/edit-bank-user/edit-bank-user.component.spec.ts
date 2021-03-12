import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBankUserComponent } from './edit-bank-user.component';

describe('EditBankUserComponent', () => {
  let component: EditBankUserComponent;
  let fixture: ComponentFixture<EditBankUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBankUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBankUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
