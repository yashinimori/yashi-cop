import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleClaimComponent } from './single-claim.component';

describe('SingleClaimComponent', () => {
  let component: SingleClaimComponent;
  let fixture: ComponentFixture<SingleClaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleClaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
