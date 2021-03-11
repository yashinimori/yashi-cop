import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MastercardRetrievalComponent } from './mastercard-retrieval.component';

describe('MastercardRetrievalComponent', () => {
  let component: MastercardRetrievalComponent;
  let fixture: ComponentFixture<MastercardRetrievalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MastercardRetrievalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MastercardRetrievalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
