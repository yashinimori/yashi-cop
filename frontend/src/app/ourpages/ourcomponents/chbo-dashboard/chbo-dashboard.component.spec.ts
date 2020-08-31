import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChboDashboardComponent } from './chbo-dashboard.component';

describe('SingleClaimComponent', () => {
  let component: ChboDashboardComponent;
  let fixture: ComponentFixture<ChboDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChboDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChboDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
