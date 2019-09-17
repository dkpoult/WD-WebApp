import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookableSessionFormComponent } from './bookable-session-form.component';

describe('BookableSessionFormComponent', () => {
  let component: BookableSessionFormComponent;
  let fixture: ComponentFixture<BookableSessionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookableSessionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookableSessionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
