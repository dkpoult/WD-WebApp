import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeAnnouncementComponent } from './make-announcement.component';

describe('MakeAnnouncementComponent', () => {
  let component: MakeAnnouncementComponent;
  let fixture: ComponentFixture<MakeAnnouncementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeAnnouncementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
