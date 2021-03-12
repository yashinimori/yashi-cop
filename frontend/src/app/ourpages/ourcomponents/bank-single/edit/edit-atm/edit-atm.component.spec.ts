import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAtmComponent } from './edit-atm.component';

describe('EditAtmComponent', () => {
  let component: EditAtmComponent;
  let fixture: ComponentFixture<EditAtmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAtmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAtmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
