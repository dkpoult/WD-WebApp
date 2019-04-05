import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostActionButtonsComponent } from './post-action-buttons.component';

describe('PostActionButtonsComponent', () => {
  let component: PostActionButtonsComponent;
  let fixture: ComponentFixture<PostActionButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostActionButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
