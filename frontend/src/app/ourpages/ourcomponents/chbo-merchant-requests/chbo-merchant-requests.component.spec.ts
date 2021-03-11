import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChboMerchantRequestsComponent } from './chbo-merchant-requests.component';

describe('ChboMerchantRequestsComponent', () => {
  let component: ChboMerchantRequestsComponent;
  let fixture: ComponentFixture<ChboMerchantRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChboMerchantRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChboMerchantRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
