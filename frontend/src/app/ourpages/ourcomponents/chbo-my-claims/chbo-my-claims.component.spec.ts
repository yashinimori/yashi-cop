import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChboMyClaimsComponent } from './chbo-my-claims.component';

describe('SingleClaimComponent', () => {
  let component: ChboMyClaimsComponent;
  let fixture: ComponentFixture<ChboMyClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChboMyClaimsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChboMyClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
