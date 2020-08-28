import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopOfficerComponent } from './top-officer.component';

describe('TopOfficerComponent', () => {
  let component: TopOfficerComponent;
  let fixture: ComponentFixture<TopOfficerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopOfficerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
