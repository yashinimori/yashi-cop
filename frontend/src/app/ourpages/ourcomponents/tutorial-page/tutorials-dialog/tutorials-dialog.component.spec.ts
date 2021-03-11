import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialsDialogComponent } from './tutorials-dialog.component';

describe('TutorialsDialogComponent', () => {
  let component: TutorialsDialogComponent;
  let fixture: ComponentFixture<TutorialsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
