import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealsComponent } from './appeals.component';

describe('AppealsComponent', () => {
  let component: AppealsComponent;
  let fixture: ComponentFixture<AppealsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppealsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
