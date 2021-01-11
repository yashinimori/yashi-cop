import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChboTasksComponent } from './chbo-tasks.component';

describe('ChboTasksComponent', () => {
  let component: ChboTasksComponent;
  let fixture: ComponentFixture<ChboTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChboTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChboTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
