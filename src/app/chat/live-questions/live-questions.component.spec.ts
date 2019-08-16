import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveQuestionsComponent } from './live-questions.component';

describe('LiveQuestionsComponent', () => {
  let component: LiveQuestionsComponent;
  let fixture: ComponentFixture<LiveQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
