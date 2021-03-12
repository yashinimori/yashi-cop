import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowClaimResultComponent } from './show-claim-result.component';

describe('ShowClaimResultComponent', () => {
  let component: ShowClaimResultComponent;
  let fixture: ComponentFixture<ShowClaimResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowClaimResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowClaimResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
