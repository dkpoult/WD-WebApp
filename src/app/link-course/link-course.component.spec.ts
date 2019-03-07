import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkCourseComponent } from './link-course.component';

describe('LinkCourseComponent', () => {
  let component: LinkCourseComponent;
  let fixture: ComponentFixture<LinkCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
