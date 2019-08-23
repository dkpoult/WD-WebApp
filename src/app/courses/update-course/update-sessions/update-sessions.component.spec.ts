import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSessionsComponent } from './update-sessions.component';

describe('UpdateSessionsComponent', () => {
  let component: UpdateSessionsComponent;
  let fixture: ComponentFixture<UpdateSessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateSessionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
